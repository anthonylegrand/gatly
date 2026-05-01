import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslation } from "react-i18next";

dayjs.extend(relativeTime);

export function useDayjs() {
  const { i18n } = useTranslation();
  const lang = i18n.language.split("-")[0];
  return (date: Parameters<typeof dayjs>[0]) => dayjs(date).locale(lang);
}
