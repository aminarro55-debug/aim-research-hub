// ==========================================
// AIM RESEARCH HUB
// Catalog + Supabase Authentication
// ==========================================


// ---------- RESEARCH CATALOG ----------

const products = [
  {
    name: "Retatrutide",
    cat: "Metabolic",
    desc: "Triple GIP/GLP-1/glucagon receptor agonist",
    page: "compounds/retatrutide.html"
  },
  {
    name: "Tirzepatide",
    cat: "Metabolic",
    desc: "Dual GIP and GLP-1 receptor agonist",
    page: "compounds/tirzepatide.html"
  },
  {
    name: "Semaglutide",
    cat: "Metabolic",
    desc: "GLP-1 receptor agonist",
    page: "compounds/semaglutide.html"
  },
  {
    name: "Tesamorelin",
    cat: "Endocrine",
    desc: "Growth hormone-releasing hormone analogue",
    page: "compounds/tesamorelin.html"
  },
  {
    name: "BPC-157",
    cat: "Tissue",
    desc: "Experimental peptide studied primarily in preclinical research",
    page: "compounds/bpc-157.html"
  },
  {
    name: "TB-500 / Thymosin β4",
    cat: "Tissue",
    desc: "Thymosin beta-4 related research",
    page: "compounds/tb-500.html"
  },
  {
    name: "CJC-1295",
    cat: "Endocrine",
    desc: "Growth hormone-releasing hormone analogue research",
    page: "compounds/cjc-1295.html"
  },
  {
    name: "Ipamorelin",
    cat: "Endocrine",
    desc: "Growth hormone secretagogue research",
    page: "compounds/ipamorelin.html"
  },
  {
    name: "Semax",
    cat: "Neuroscience",
    desc: "Experimental peptide studied in neuroscience research",
    page: "compounds/semax.html"
  },
  {
    name: "Selank",
    cat: "Neuroscience",
    desc: "Experimental peptide studied in neuroscience research",
    page: "compounds/selank.html"
  }
];

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const count = document.getElementById("count");
const filters = document.getElementById("filters");

let active = "All";

if (grid && search && count && filters) {

  const categories = [
    "All",
    ...new Set(products.map(product => product.cat))
  ];

  filters.innerHTML = categories
    .map(category => `
      <button
        class="${category === "All" ? "active" : ""}"
        data-cat="${category}"
        type="button"
      >
        ${category}
      </button>
    `)
    .join("");


  function renderCatalog() {

    const query = search.value.toLowerCase().trim();

    const results = products.filter(product => {

      const categoryMatch =
        active === "All" || product.cat === active;

      const text =
        `${product.name} ${product.cat} ${product.desc}`.toLowerCase();

      const searchMatch = text.includes(query);

      return categoryMatch && searchMatch;
    });


    count.textContent =
      `${results.length} ${results.length === 1 ? "result" : "results"}`;


    grid.innerHTML = results
      .map(product => `
        <article class="card">

          <div class="eyebrow">
            ${product.cat}
          </div>

          <h3>${product.name}</h3>

          <p>${product.desc}</p>

          <a href="${product.page}">
            Explore research →
          </a>

        </article>
      `)
      .join("");


    if (results.length === 0) {
      grid.innerHTML = `
        <article class="card">
          <h3>No results found</h3>
          <p>Try another compound or research category.</p>
        </article>
      `;
    }
  }


  search.addEventListener("input", renderCatalog);


  filters.addEventListener("click", event => {

    if (event.target.tagName !== "BUTTON") return;

    active = event.target.dataset.cat;

    filters
      .querySelectorAll("button")
      .forEach(button => button.classList.remove("active"));

    event.target.classList.add("active");

    renderCatalog();
  });


  renderCatalog();
}



// ==========================================
// SUPABASE CONNECTION
// ==========================================

const SUPABASE_URL =
  "https://mkxhosiptmmhotlqcqpy.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_dvVyamZ5BKFopo_O2nC3EA_VahXHEbA";


let supabaseClient = null;

if (window.supabase) {

  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

} else {

  console.error("Supabase library failed to load.");

}



// ==========================================
// AUTH ELEMENTS
// ==========================================

const authLoggedOut =
  document.getElementById("authLoggedOut");

const authLoggedIn =
  document.getElementById("authLoggedIn");

const communityLoggedOut =
  document.getElementById("communityLoggedOut");

const communityLoggedIn =
  document.getElementById("communityLoggedIn");

const communityUser =
  document.getElementById("communityUser");

const userEmail =
  document.getElementById("userEmail");


const signupEmail =
  document.getElementById("signupEmail");

const signupPassword =
  document.getElementById("signupPassword");

const signupButton =
  document.getElementById("signupButton");

const signupMessage =
  document.getElementById("signupMessage");


const loginEmail =
  document.getElementById("loginEmail");

const loginPassword =
  document.getElementById("loginPassword");

const loginButton =
  document.getElementById("loginButton");

const loginMessage =
  document.getElementById("loginMessage");


const logoutButton =
  document.getElementById("logoutButton");



// ==========================================
// DISPLAY LOGIN STATE
// ==========================================

function updateAuthDisplay(user) {

  if (user) {

    if (authLoggedOut) {
      authLoggedOut.style.display = "none";
    }

    if (authLoggedIn) {
      authLoggedIn.style.display = "block";
    }

    if (communityLoggedOut) {
      communityLoggedOut.style.display = "none";
    }

    if (communityLoggedIn) {
      communityLoggedIn.style.display = "block";
    }

    if (userEmail) {
      userEmail.textContent = user.email || "Member";
    }

    if (communityUser) {
      communityUser.textContent =
        `Signed in as ${user.email || "member"}`;
    }

  } else {

    if (authLoggedOut) {
      authLoggedOut.style.display = "block";
    }

    if (authLoggedIn) {
      authLoggedIn.style.display = "none";
    }

    if (communityLoggedOut) {
      communityLoggedOut.style.display = "block";
    }

    if (communityLoggedIn) {
      communityLoggedIn.style.display = "none";
    }

    if (userEmail) {
      userEmail.textContent = "";
    }

    if (communityUser) {
      communityUser.textContent = "";
    }

  }

}



// ==========================================
// SIGN UP
// ==========================================

async function signUp() {

  if (!supabaseClient) {
    signupMessage.textContent =
      "Account service is currently unavailable.";
    return;
  }


  const email =
    signupEmail.value.trim();

  const password =
    signupPassword.value;


  signupMessage.textContent = "";


  if (!email || !password) {

    signupMessage.textContent =
      "Enter an email address and password.";

    return;
  }


  if (password.length < 6) {

    signupMessage.textContent =
      "Password must contain at least 6 characters.";

    return;
  }


  signupButton.disabled = true;
  signupButton.textContent = "Creating account...";


  const { data, error } =
    await supabaseClient.auth.signUp({
      email: email,
      password: password
    });


  signupButton.disabled = false;
  signupButton.textContent = "Sign up";


  if (error) {

    signupMessage.textContent =
      error.message;

    return;
  }


  if (data.session) {

    signupMessage.textContent =
      "Account created. You are now signed in.";

    updateAuthDisplay(data.user);

  } else {

    signupMessage.textContent =
      "Account created. Check your email to confirm your account.";

  }

}



// ==========================================
// LOG IN
// ==========================================

async function logIn() {

  if (!supabaseClient) {
    loginMessage.textContent =
      "Account service is currently unavailable.";
    return;
  }


  const email =
    loginEmail.value.trim();

  const password =
    loginPassword.value;


  loginMessage.textContent = "";


  if (!email || !password) {

    loginMessage.textContent =
      "Enter your email address and password.";

    return;
  }


  loginButton.disabled = true;
  loginButton.textContent = "Logging in...";


  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });


  loginButton.disabled = false;
  loginButton.textContent = "Log in";


  if (error) {

    loginMessage.textContent =
      error.message;

    return;
  }


  loginMessage.textContent = "";

  updateAuthDisplay(data.user);

}



// ==========================================
// LOG OUT
// ==========================================

async function logOut() {

  if (!supabaseClient) return;


  const { error } =
    await supabaseClient.auth.signOut();


  if (error) {

    console.error(
      "Logout error:",
      error.message
    );

    return;
  }


  updateAuthDisplay(null);

}



// ==========================================
// BUTTON EVENTS
// ==========================================

if (signupButton) {

  signupButton.addEventListener(
    "click",
    signUp
  );

}


if (loginButton) {

  loginButton.addEventListener(
    "click",
    logIn
  );

}


if (logoutButton) {

  logoutButton.addEventListener(
    "click",
    logOut
  );

}



// Allow Enter key in signup fields

if (signupPassword) {

  signupPassword.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        signUp();
      }

    }
  );

}


// Allow Enter key in login fields

if (loginPassword) {

  loginPassword.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        logIn();
      }

    }
  );

}



// ==========================================
// CHECK EXISTING SESSION
// ==========================================

async function initializeAuth() {

  if (!supabaseClient) {
    updateAuthDisplay(null);
    return;
  }


  const {
    data: { session }
  } =
    await supabaseClient.auth.getSession();


  updateAuthDisplay(
    session ? session.user : null
  );

}



// ==========================================
// LISTEN FOR AUTH CHANGES
// ==========================================

if (supabaseClient) {

  supabaseClient.auth.onAuthStateChange(
    (event, session) => {

      updateAuthDisplay(
        session ? session.user : null
      );

    }
  );

}



// Start authentication

initializeAuth();
