export class StringUtils {
  static fixTruncationIfNeeded(
    title: string,
    author: string,
    char_separator: string,
  ): string {
    const video_namestring_len = title.length + author.length +
      char_separator.length;
    let adjusted_title = title;

    if (
      video_namestring_len > 47 && video_namestring_len < 84 ||
      video_namestring_len > 112 && video_namestring_len < 150
    ) {
      const formatting_spaces = ".".repeat(35);
      adjusted_title = adjusted_title.concat(formatting_spaces);
    }

    return adjusted_title;
  }
}
