"use strict";
const publications = document.querySelector(".publications");
let publicationIndex = 0;

const createPublicationComponent = (author, publicationContent) => {
    //HTML Elements
    const publication = document.createElement("DIV");
    const title = document.createElement("H3");
    const content = document.createElement("P");
    const comments = document.createElement("DIV");
    const comment = document.createElement("INPUT");
    const send = document.createElement("INPUT");

    //Class edition
    publication.classList.add("publication");
    comments.classList.add("comments");
    comment.classList.add("comment");
    send.classList.add("send");

    //Attributes edition
    comment.setAttribute("placeholder","What do you think about it...?");
    send.setAttribute("type","submit");
    send.setAttribute("value","Send");

    //content edition
    title.textContent = author;
    content.textContent = publicationContent;

    //Assembly
    comments.appendChild(comment);
    comments.appendChild(send);

    publication.appendChild(title);
    publication.appendChild(content);
    publication.appendChild(comments);

    return publication;
};


const loadMorePublications = (entry) => {
    if(entry[0].isIntersecting) loadPublications(3);
};

let loadOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
    };

const publicationObserver = new IntersectionObserver(loadMorePublications, loadOptions);

const loadPublications = async (amount) => {
    const request = await fetch("/resources/publications.json");
    const response = await request.json();
    const publicationList = response.publications;

    const documentFragment = document.createDocumentFragment();

    for (let i = 0; i < amount; i++) {
        if (publicationList[publicationIndex] != undefined) {
            let author = publicationList[publicationIndex].name;
            let publicationContent = publicationList[publicationIndex].content;

            const newPublication = createPublicationComponent(author,publicationContent);
            //Append observer, at last publication to load more publications if available
            if(i == amount - 1) publicationObserver.observe(newPublication);

            documentFragment.appendChild(newPublication);
            publicationIndex++;
        }
        else {
            //eop = End of Publications
            if (document.getElementById("EoP") === null) {
                let noMore = document.createElement("H3");

                noMore.setAttribute("id","EoP");

                noMore.textContent = "No more publications available.";

                documentFragment.appendChild(noMore);
                break;
            }
        }
    }

    publications.appendChild(documentFragment);
};

loadPublications(4);