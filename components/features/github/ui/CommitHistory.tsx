"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GithubService } from "../lib/github.service";
import { GithubCommit, GithubRepo } from "../model/types";

export const CommitHistory = () => {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [commits, setCommits] = useState<GithubCommit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      if (session?.accessToken) {
        try {
          setIsLoading(true);
          const userRepos = await GithubService.getUserRepos(
            session.accessToken as string
          );
          setRepos(userRepos);
        } catch (err) {
          setError("저장소 목록을 불러오는데 실패했습니다.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRepos();
  }, [session]);

  const handleRepoChange = async (repoFullName: string) => {
    if (!session?.accessToken) return;

    setSelectedRepo(repoFullName);
    try {
      setIsLoading(true);
      const repoCommits = await GithubService.getRepoCommits(
        session.accessToken as string,
        repoFullName
      );
      setCommits(repoCommits);
    } catch (err) {
      setError("커밋 내역을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return <div className="text-center p-4">깃허브로 로그인이 필요합니다.</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">깃허브 커밋 히스토리</h2>

      <div className="mb-4">
        <select
          className="w-full p-2 border rounded-lg"
          value={selectedRepo}
          onChange={(e) => handleRepoChange(e.target.value)}
        >
          <option value="">저장소를 선택하세요</option>
          {repos.map((repo) => (
            <option key={repo.id} value={repo.full_name}>
              {repo.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center">로딩 중...</div>
      ) : (
        <div className="space-y-4">
          {commits.map((commit) => (
            <div
              key={commit.sha}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{commit.commit.message}</p>
                  <p className="text-sm text-gray-500">
                    {commit.commit.author.name} •{" "}
                    {new Date(commit.commit.author.date).toLocaleDateString(
                      "ko-KR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
                <a
                  href={commit.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  보기
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
