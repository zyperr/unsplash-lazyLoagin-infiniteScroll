const isIntersecting = (entry) => {
    return entry.isIntersecting; // true si esta dentro de la pantalla
  };
  
  const loadImage = (entry) => {
    //Guardamos el la entrada  de cada nodo
    const container = entry.target;
    const image = container.childNodes[1];
    const profilePicture = container.childNodes[0].firstChild;
    const profileUrl = profilePicture.dataset.src;
    const imageUrl = image.dataset.src;
    //carga la imagen
    profilePicture.src = profileUrl;
    image.src = imageUrl;
    //comprobamos si se esta intersectando y si es visible dicho nodo
    if (entry.isIntersecting) {
  
      //si un nodo ya esta observado se deja de observar dicho nodo
      observer.unobserve(container);
      console.log("hola")
    }
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.filter(isIntersecting).forEach(loadImage);
  });
  
  export const registerImage = (image) => {
    // IntersectactionObservador -> observer(image)
    observer.observe(image);
  };
  