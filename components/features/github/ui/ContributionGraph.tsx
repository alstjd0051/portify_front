"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GithubService } from "../lib/github.service";
import { ContributionData } from "../model/types";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

export const ContributionGraph = () => {
  const { data: session } = useSession();
  const [contributions, setContributions] = useState<ContributionData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributions = async () => {
      if (session?.accessToken) {
        try {
          setIsLoading(true);
          const userProfile = await GithubService.getUserProfile(
            session.accessToken as string
          );
          const contributionData = await GithubService.getContributions(
            session.accessToken as string,
            userProfile.login
          );
          setContributions(contributionData);
        } catch (err) {
          setError("컨트리뷰션 데이터를 불러오는데 실패했습니다.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchContributions();
  }, [session]);

  if (!session) {
    return <div className="text-center p-4">깃허브로 로그인이 필요합니다.</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4">로딩 중...</div>;
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-gray-100";
      case 1:
        return "bg-green-100";
      case 2:
        return "bg-green-300";
      case 3:
        return "bg-green-500";
      case 4:
        return "bg-green-700";
      default:
        return "bg-gray-100";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${
      MONTHS[date.getMonth()]
    } ${date.getDate()}일`;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">깃허브 컨트리뷰션</h2>
        {contributions && (
          <p className="text-gray-600">
            총 {contributions.totalContributions}개의 컨트리뷰션
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="flex mb-2">
            <div className="w-8" /> {/* 요일 레이블용 공간 */}
            <div className="flex gap-1">
              {MONTHS.map((month) => (
                <div key={month} className="w-7 text-xs text-gray-500">
                  {month}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-1">
            <div className="flex flex-col gap-1 pr-2">
              {WEEKDAYS.map((day) => (
                <div key={day} className="h-4 text-xs text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-flow-col gap-1">
              {contributions?.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.days.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-4 h-4 rounded-sm ${getLevelColor(
                        day.level
                      )} 
                        cursor-pointer transition-colors hover:ring-2 hover:ring-gray-300`}
                      title={`${formatDate(day.date)}: ${
                        day.count
                      }개의 컨트리뷰션`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs text-gray-500">기여도:</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-4 h-4 rounded-sm ${getLevelColor(level)}`}
                  title={`레벨 ${level}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
