import "./main.css";
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const noteForm = document.querySelector("#noteForm");
const submitTextBtn = document.querySelector("#submitTextBtn");
const submitTextSpinner = document.querySelector("#submitTextSpinner");
const heading = document.querySelector(".cover-heading h2");
const homeTabTextPrompt = document.querySelector("#homeTabTextPrompt");
const titleInput = document.querySelector("#titleInput");
const contentInput = document.querySelector("#contentInput");
const notesContainer = document.querySelector("#notes");
const notesSpinner = document.querySelector("#notesSpinner");
const audio = document.querySelector("audio");

// TODO(inject URL via build tool)
const API_URL_BASE = "https://davidguan.app";
// const API_URL_BASE = "http://localhost:8080";
const BUCKET_URL = "https://voice-notes-app.s3-ap-southeast-2.amazonaws.com";
const tabKeys = ["homeTab", "noteSubmitTab"];

let activeTabContent = document.querySelector("#homeTabContent");
let activeTabLink = document.querySelector("#homeTabLink");
function setupTabs() {
  for (const tab of tabKeys) {
    const link = document.querySelector(`#${tab}Link`);
    const content = document.querySelector(`#${tab}Content`);
    link.addEventListener("click", () => {
      activeTabContent.style.display = "none";
      activeTabContent = content;
      activeTabContent.style.display = "block";

      activeTabLink.classList.remove("active");
      activeTabLink = link;
      activeTabLink.classList.add("active");
    });
  }
}
setupTabs();

function genHeaders({ acc }) {
  const headers = {};
  if (acc) {
    headers["Authorization"] = `Bearer ${acc}`;
  }
  return headers;
}

function setupNoteForm(acc) {
  noteForm.style.display = "block";
  notesSpinner.style.display = "block";
  submitTextBtn.addEventListener("click", event => {
    event.preventDefault();
    const title = titleInput.value;
    const content = contentInput.value;
    const postBody = JSON.stringify({ title, content });
    submitTextSpinner.style.display = "inline-block";
    submitTextBtn.style.display = "none";
    fetch(`${API_URL_BASE}/voice-notes`, {
      method: "POST",
      headers: {
        ...genHeaders({ acc }),
        "Content-Type": "application/json"
      },
      body: postBody
    }).then(() => {
      submitTextBtn.style.display = "inline-block";
      titleInput.value = "";
      contentInput.value = "";
      submitTextSpinner.style.display = "none";
    });
  });
  fetch(`${API_URL_BASE}/voice-notes`, {
    headers: {
      ...genHeaders({ acc })
    }
  })
    .then(ret => {
      if (ret.status != 200) {
        notesSpinner.style.display = "none";
        homeTabTextPrompt.innerText =
          "Sorry, this app is in the early test stage, only a small list of accounts are allowed to interacting with the APIs, please ask davidguandev@gmail.com to add your account, if you are interested to give it a go, thanks!";
      }
      return ret.json();
    })
    .then(ret => {
      if (!Array.isArray(ret)) {
        return;
      }
      notesSpinner.style.display = "none";
      if (ret.length == 0) {
        homeTabTextPrompt.innerText = "Thanks for using this app, please click \"submit new note\" to create your first note :)";
        return;
      }
      audio.style.display = "block";
      ret.forEach(d => {
        const button = document.createElement("button");
        button.innerText = d.name;
        button.className = "btn btn-outline-primary note";
        const url = `${BUCKET_URL}/${d.key}`;
        button.addEventListener("click", () => {
          audio.src = url;
          audio.play();
        });
        notesContainer.append(button);
      });
    })
    .catch(e => {
      notesSpinner.style.display = "none";
      throw e;
    });
}

// TODO: inject config at build time when multi envs provisioned.
// (and prevent the two copies of config).
const auth0Conifg = {
  domain: "davidguan.auth0.com",
  clientId: "luC7PVwEEmjBTCC3HUenRepY5U3Zgrru",
  audience: "https://davidguan.app/voice-notes-app/api"
};

function updateUi(auth0) {
  auth0.isAuthenticated().then(authed => {
    loginBtn.disabled = authed;
    logoutBtn.disabled = !authed;

    if (authed) {
      auth0.getTokenSilently().then(acc => {
        setupNoteForm(acc);
      });

      auth0.getUser().then(info => {
        if (info.nickname) {
          heading.innerText = `Hello, ${info.nickname}`;
        }
      });
    }
  });
}

createAuth0Client({
  domain: auth0Conifg.domain,
  client_id: auth0Conifg.clientId,
  audience: auth0Conifg.audience
}).then(auth0 => {
  updateUi(auth0);
  const currentPage = location.origin + location.pathname;
  loginBtn.addEventListener("click", () => {
    auth0.loginWithRedirect({
      redirect_uri: currentPage
    });
  });

  logoutBtn.addEventListener("click", () => {
    auth0.logout({
      returnTo: currentPage
    });
  });

  const query = location.search;
  if (query.includes("code=") && query.includes("state=")) {
    auth0.handleRedirectCallback().then(() => {
      history.replaceState(
        {},
        document.title,
        currentPage
      );
      updateUi(auth0);
    });
  }

  // TODO: handle the auth error case(query string would give clue).
});
