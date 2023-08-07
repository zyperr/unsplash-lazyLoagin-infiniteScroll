import { registerImage } from "./lazy-loading.js";

const ACCESS_KEY = "FqBaVbq4WBKXi1HoQyvZ6ncEbEZ4dqx8h1I_MPQKdos";
const endpoint = `https://api.unsplash.com/photos/?client_id=${ACCESS_KEY}`;

const app = document.getElementById("app");
const footer = document.querySelector("footer");
const isLazy = 'loading' in HTMLImageElement.prototype // Checking if browser support lazyloading
let page = 1;
const classForIcons = [
  "fa-regular fa-heart",
  "fa-brands fa-instagram",
  "fa-solid fa-file-arrow-down",
];


async function fetchData() {
  try {
    const reponse = await fetch(`${endpoint}&page=${page}`);
    const data = await reponse.json();

    const sources = data.map((data) => {
      return {
        profile: data.user.profile_image.medium,
        walpapper: data.urls.regular,
        download: data.links.download + "&force=true&w=1920",
        instagram: data.user.instagram_username,
        likes: data.user.total_likes,
        altImg: data.alt_description,
      };
    });

    cardImage(sources);
  } catch (err) {
    console.error(`error: ${err}`);
  }
}

const cardImage = (sources) => {
  const nodos = [];
  sources.map((item) => {
    const container = document.createElement("article");
    const picture = document.createElement("picture");
    const profilePicture = document.createElement("img");
    const img = document.createElement("img");

    const banner = document.createElement("div");
    const ul = document.createElement("ul");
    const li = document.createElement("li");
    const liLikes = document.createElement("li");
    const A_Download = document.createElement("a");
    const iIntagram = document.createElement("i");
    const iLikes = document.createElement("i");
    const iDownload = document.createElement("i");
    //adding class for i elements (font aweson)
    iIntagram.setAttribute("class", classForIcons[1]);
    iLikes.setAttribute("class", classForIcons[0]);
    iDownload.setAttribute("class", classForIcons[2]);

    //download button
    A_Download.href = item.download;
    A_Download.setAttribute("download", "");
    A_Download.setAttribute("target", "_blank");
    A_Download.insertAdjacentElement("afterbegin", iDownload);
    //icons likes and instagram
    li.insertAdjacentElement("afterbegin", iIntagram);
    liLikes.insertAdjacentElement("afterbegin", iLikes);
    li.insertAdjacentHTML(
      "beforeend",
      `<a href="https://www.instagram.com/${
        item.instagram ?? ""
      }/?theme=dark" target="_blank">${item.instagram ?? "not found"}</a>`
    );
    liLikes.insertAdjacentText("beforeend", item.likes ?? 0);
    //append instagram likes and download button to ul
    ul.append(li, liLikes, A_Download);
    //profile picture
    profilePicture.setAttribute("class", "profile-picture --show-on-hover");
    //image
    if(isLazy){
      img.loading = 'lazy'
      profilePicture.loading = 'lazy'
      img.src = item.walpapper;
      profilePicture.src = item.profile;

    }else{
      img.dataset.src = item.walpapper;
      profilePicture.dataset.src = item.profile;
    }
    img.alt = item.altImg;
    img.classList.add("walpapper");
    //overlay/banner
    banner.classList.add("banner");
    ul.setAttribute("class", "flex flex-row justify-center items-center gap-3");
    container.classList.add("grid-item")
    picture.appendChild(profilePicture);
    banner.appendChild(ul);
    container.append(picture, img, banner);
    //If a image is intersecting at viewport 
    !isLazy && registerImage(container);

    nodos.push(container);
    return app.append(...nodos);
  });
};
//llamamos una primera vez a fetchData para mostrar el contenido de la primera pagina

//observamos el footer para cargar mas elementos y sumamos a la variable page 1 esto cambia a la siguiente pagina de la api
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if(page < 1 || page > 20) return
      page++
      fetchData()
    }
  });
});
observer.observe(footer);

fetchData();