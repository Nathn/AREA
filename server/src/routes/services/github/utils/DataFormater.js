
class DataFormater {
  constructor(githubApiHandler) {
    this.githubApiHandler = githubApiHandler;
  }

  formatUser(githubUser) {
    return {
      id: githubUser.id,
      name: githubUser.name,
      username: githubUser.login,
      avatar: githubUser.avatar_url,
      url: githubUser.html_url,
    };
  }

  formatPublicRepositoriesData(publicRepositories, publicRepositoriesCommits) {
    const result = publicRepositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      commits: publicRepositoriesCommits.find((item) => item.repo_id === repo.id)?.commits,
    }));

    return result;
  }

  formatPublicStarredRepositoriesData(publicStarredRepositories) {
    const result = publicStarredRepositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
    }));

    return result;
  }

  formatPublicRepositoriesCommits(publicRepositories) {
    return Promise.all(
      publicRepositories.map(async (repo) => {
        const commits = await this.githubApiHandler.getCommitsForPublicRepository(repo?.owner?.login, repo?.name);
        return {
          repo_id: repo.id,
          commits: commits,
        };
      })
    );
  }

  formatPublicRepositoriesPullRequests(publicRepositories) {
    return Promise.all(
      publicRepositories.map(async (repo) => {
        const pullRequests = await this.githubApiHandler.getPullRequestsForPublicRepository(repo?.owner?.login, repo?.name);
        return {
          repo_id: repo.id,
          pullRequests: pullRequests,
        };
      })
    );
  }
}

module.exports = DataFormater;
