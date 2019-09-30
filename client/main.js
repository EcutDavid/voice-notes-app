const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
// TODO: inject config at build time when multi envs provisioned.
const auth0Conifg = {
  domain: "davidguan.auth0.com",
  clientId: "luC7PVwEEmjBTCC3HUenRepY5U3Zgrru",
  audience: "https://davidguan.me/test"
};

function updateAuthUi(auth0) {
  auth0.isAuthenticated().then(authed => {
    loginBtn.disabled = authed;
    logoutBtn.disabled = !authed;

    if (authed) {
      auth0.getTokenSilently().then(acc => {
        return fetch("http://localhost:8080" + "/foo", {
          headers: {
            Authorization: `Bearer ${acc}`
          }
        });
      }).then(res => {
        return res.text();
      }).then(text => {
        /* Just for fun */
        const heading = document.querySelector(".cover-heading");
        heading.innerText = text;
      });

      // auth0.getUser().then(userInfo => {

      // });
    }
  });
}

createAuth0Client({
  domain: auth0Conifg.domain,
  client_id: auth0Conifg.clientId,
  audience: auth0Conifg.audience
}).then(auth0 => {
  updateAuthUi(auth0);
  const pageCur = location.origin + location.pathname;
  loginBtn.addEventListener("click", () => {
    auth0.loginWithRedirect({
      redirect_uri: pageCur
    });
  });

  logoutBtn.addEventListener("click", () => {
    auth0.logout({
      returnTo: pageCur
    });
  });

  const query = location.search;
  // Back from the login page.
  if (query.includes("code=") && query.includes("state=")) {
    auth0.handleRedirectCallback().then(() => {
      history.replaceState(
        {},
        document.title,
        location.origin + location.pathname
      );
      updateAuthUi(auth0);
    });
  }
});
