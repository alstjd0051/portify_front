import {
  GithubCommit,
  GithubRepo,
  GithubUserProfile,
  ContributionData,
} from "../model/types";

export class GithubService {
  private static async fetchWithAuth(url: string, accessToken: string) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error("깃허브 API 호출 중 오류가 발생했습니다.");
    }

    return response.json();
  }

  private static async fetchGraphQL(query: string, accessToken: string) {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error("깃허브 GraphQL API 호출 중 오류가 발생했습니다.");
    }

    return response.json();
  }

  static async getUserProfile(accessToken: string): Promise<GithubUserProfile> {
    return this.fetchWithAuth("https://api.github.com/user", accessToken);
  }

  static async getUserRepos(accessToken: string): Promise<GithubRepo[]> {
    return this.fetchWithAuth("https://api.github.com/user/repos", accessToken);
  }

  static async getRepoCommits(
    accessToken: string,
    repoFullName: string
  ): Promise<GithubCommit[]> {
    return this.fetchWithAuth(
      `https://api.github.com/repos/${repoFullName}/commits`,
      accessToken
    );
  }

  static async getContributions(
    accessToken: string,
    username: string
  ): Promise<ContributionData> {
    const query = `
      query {
        user(login: "${username}") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const response = await this.fetchGraphQL(query, accessToken);
    const calendar =
      response.data.user.contributionsCollection.contributionCalendar;

    return {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks.map((week: any) => ({
        days: week.contributionDays.map((day: any) => ({
          date: day.date,
          count: day.contributionCount,
          level: this.getContributionLevel(day.contributionCount),
        })),
      })),
    };
  }

  private static getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
  }
}
