/**
 * Converte uma string de timestamp para Date object tratando como hora local
 * Evita conversão de timezone que causa diferença de horas
 */
export function parseTimestampAsLocal(value: any): Date | null {
  if (!value) return null;
  
  // Se já for Date object, retornar como está
  if (value instanceof Date) {
    return value;
  }
  
  // Se for string, tratar como hora local (sem conversão de timezone)
  if (typeof value === 'string') {
    // Remover 'Z' e timezone se existir (formato ISO UTC)
    let dateStr = value.replace(/Z$/, '').replace(/[+-]\d{2}:\d{2}$/, '');
    
    // Substituir 'T' por espaço se existir
    dateStr = dateStr.replace('T', ' ');
    
    // Parse da string no formato "YYYY-MM-DD HH:mm:ss" ou "YYYY-MM-DD HH:mm:ss.sss"
    const parts = dateStr.split(' ');
    if (parts.length === 2) {
      const [datePart, timePart] = parts;
      const [year, month, day] = datePart.split('-').map(Number);
      const timeParts = timePart.split(':');
      const hour = Number(timeParts[0]);
      const minute = Number(timeParts[1]);
      const second = timeParts[2] ? Number(timeParts[2].split('.')[0]) : 0;
      
      // Criar Date no timezone local (sem conversão UTC)
      return new Date(year, month - 1, day, hour, minute, second);
    }
    
    // Fallback: tentar parse direto
    return new Date(value);
  }
  
  return new Date(value);
}

/**
 * Formata um timestamp para exibição legível
 */
export function formatTimestamp(value: any): string {
  const date = parseTimestampAsLocal(value);
  if (!date || isNaN(date.getTime())) return 'N/A';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

