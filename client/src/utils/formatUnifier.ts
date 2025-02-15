export namespace FormatUnifier {
  /**
   * @returns 2020.12.14 12:12
   * @returns 2020.1.5 05:05
   */
  export function getFullFormatDate(date: Date = new Date()): string {
    const hour: string = date.getHours() < 10 ? '0' + date.getHours() : date.getHours().toString();
    const minute: string = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes().toString();

    const formatDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${hour}:${minute}`;

    return formatDate;
  }
}
