// src/utils/pix.ts

/** Utilitários de BR Code (PIX estático "copia e cola") em EMVCo TLV.  **/

/** Monta um campo TLV (Tag-Length-Value). */
function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

/** Remove acentos/diacríticos e caracteres fora do ASCII básico. */
function sanitizeAscii(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // remove diacríticos
    .replace(/[^\x20-\x7E]/g, "");     // remove não-ASCII (mantém espaço e visíveis)
}

/** Corta a string no tamanho máximo informado, garantindo ASCII sem acentos. */
function cutAscii(input: string, maxLen: number): string {
  return sanitizeAscii(input).slice(0, maxLen);
}

/** Formata valor p/ "123.45". Retorna undefined se não for número válido. */
function formatAmount(amount?: string | number): string | undefined {
  if (amount === undefined || amount === null) return undefined;
  const n = Number(String(amount).replace(",", "."));
  if (!isFinite(n) || n <= 0) return undefined;
  return n.toFixed(2); // 2 casas decimais
}

/** CRC16-CCITT (polinômio 0x1021), init 0xFFFF, retorna em HEX maiúsculo (4 chars). */
function crc16Ccitt(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export type BuildPixParams = {
  key: string;              // Chave PIX (email/telefone/EVP/CPF/CNPJ)
  merchantName: string;     // Nome recebedor (<=25, sem acento)
  merchantCity: string;     // Cidade (<=15, sem acento)
  txid: string;             // TXID (<=25, sem espaços)
  amount?: number | string; // Valor opcional (fixo)
  description?: string;     // Descrição opcional (curta)
};

/** Gera a string PIX (EMVCo) válida para "copia e cola". */
export function buildPixPayload(params: BuildPixParams): string {
  const { key, merchantName, merchantCity, txid, amount, description } = params;

  const keyClean = key.trim();
  const name = cutAscii(merchantName, 25);     // ID 59
  const city = cutAscii(merchantCity, 15);     // ID 60
  const tx = cutAscii(txid.replace(/\s+/g, ""), 25);
  const desc = description ? cutAscii(description, 50) : undefined;

  const id00 = tlv("00", "01");        // Payload Format Indicator
  const id01 = tlv("01", "11");        // Point of Initiation Method (estático)
  const id26 = tlv("26",               // Merchant Account Information (subcampos)
    tlv("00", "br.gov.bcb.pix") +      // GUI
    tlv("01", keyClean) +              // Chave PIX
    (desc ? tlv("02", desc) : "")      // Descrição opcional
  );
  const id52 = tlv("52", "0000");      // MCC
  const id53 = tlv("53", "986");       // Moeda BRL
  const id54 = ((): string => {        // Valor (opcional)
    const amt = formatAmount(amount);
    return amt ? tlv("54", amt) : "";
  })();
  const id58 = tlv("58", "BR");        // País
  const id59 = tlv("59", name);        // Nome
  const id60 = tlv("60", city);        // Cidade
  const id62 = tlv("62", tlv("05", tx)); // Additional Data (TXID)

  const partial = `${id00}${id01}${id26}${id52}${id53}${id54}${id58}${id59}${id60}${id62}`;
  const toCrc = `${partial}6304`;
  const crc = crc16Ccitt(toCrc);
  const id63 = `63${"04"}${crc}`;

  return `${partial}${id63}`;
}
