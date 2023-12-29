export function getGitHubUrl(from) {
  const rootURl = 'https://github.com/login/oauth/authorize';

  const options = {
    client_id: process.env.REACT_APP_GITHUB_OAUTH_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URL,
    scope: 'user:email',
    state: from,
  };

  const qs = new URLSearchParams(options);

  var qsString = qs.toString();
  const qsArray = qsString.split('&');
  for (let i = 0; i < qsArray.length; i++) {
    if (qsArray[i].includes('redirect_uri')) {
      qsArray.splice(i, 1);
    }
  }
  qsString = qsArray.join('&');
  console.log(qsString);

  return `${rootURl}?${qsString}`;
}
