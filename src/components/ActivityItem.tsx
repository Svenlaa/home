import {
  faClock,
  faGaugeHigh,
  faMapLocationDot,
  faRoute,
  faTrash,
  IconDefinition,
  faCalendarPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TRun } from "../../drizzle/schema";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { formatToTimeString } from "../utils/time";
import Link from "next/link";

type Props = {
  item: TRun;
  isAuthed?: boolean;
  onDelete?: (runId: string) => void;
};

const ActivityItem = ({
  item,
  isAuthed: isAuthed,
  onDelete = () => null,
}: Props) => {
  const router = useRouter();
  const dateString = new Date(item.date).toLocaleDateString(router.locale, {
    dateStyle: "long",
  });
  return (
    <div
      className={`mx-auto my-4 flex flex-col justify-between rounded-lg border-2 bg-white p-4 px-6 dark:bg-white/10 ${
        item.isEvent ? "border-amber-400" : "border-gray-400"
      }`}
    >
      <div className="flex flex-row justify-between text-lg">
        <p
          className={`font-bold ${
            item.isEvent
              ? "text-amber-600 dark:text-amber-400"
              : "text-prime-700 dark:text-prime-400"
          }`}
        >
          {dateString}
        </p>
        {isAuthed && (
          <div className="flex flex-row gap-2">
            {!item.time && (
              <Link
                href={`/running/${item.id}/addTime`}
                className="ml-1 text-amber-600 hover:text-amber-500 dark:text-amber-400"
              >
                <FontAwesomeIcon icon={faCalendarPlus} />
              </Link>
            )}
            <button
              className="ml-1 text-red-600 hover:text-red-500 dark:text-red-400"
              onClick={() => onDelete(item.id)}
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      </div>
      <div className="mt-2 flex flex-row flex-nowrap justify-between">
        {item.location && !item.time && (
          <Detail icon={faMapLocationDot}>{item.location}</Detail>
        )}
        {item.time && (
          <Detail icon={faClock}>{formatToTimeString(item.time)}</Detail>
        )}
        <Detail icon={faRoute}>{item.distance / 1000}km</Detail>
        {item.time && item.distance && (
          <Detail icon={faGaugeHigh}>
            {(item.distance / 1000 / (item.time / 3600)).toFixed(1)} km/h
          </Detail>
        )}
      </div>
    </div>
  );
};

type DetailProps = { children: ReactNode; icon?: IconDefinition };
const Detail = ({ icon, children }: DetailProps) => (
  <span className="mx-1 whitespace-nowrap text-center text-gray-800 dark:text-gray-100">
    {icon && (
      <FontAwesomeIcon
        icon={icon}
        className="mr-1 text-gray-600 dark:text-gray-300"
      />
    )}
    {children}
  </span>
);

export default ActivityItem;
