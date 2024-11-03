import { getIconUrl } from '../icon/icons.js';

export function createCompanyHeader() {
    const section = document.createElement('section');
    section.id = 'companyHeader';
    section.innerHTML = `
    <div class="companyHeaderContent">
        <ol id="companySocialNetworks"></ol>
        <div class="companyHeaderTxt">
            <img id="companyHeaderLogo" src="" alt="logo">
            <h1>Company Name</h1>
            <h2>(description)</h2>
            <button id="horariosModal">> ver horarios</button>
            <button id="whatsappModal">> Whatsapp</button>
        </div>
    </div>
    `;
    return section;
}

export function updateCompanyHeader(companyData) {
    const headerSection = document.getElementById('companyHeader');
    const socialNetworksList = document.getElementById('companySocialNetworks');
    const logoImage = document.getElementById('companyHeaderLogo');
    const companyName = headerSection.querySelector('h1');
    const companyDescription = headerSection.querySelector('h2');

    if (companyData.heroBackgroundImage) {
        headerSection.style.backgroundImage = `url(${companyData.heroBackgroundImage})`;
    }

    if (companyData.socialNetworks) {
        companyData.socialNetworks.forEach(network => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = network.link;

            const iconUrl = getIconUrl(network.name.toLowerCase());
            if (iconUrl) {
                const img = document.createElement('img');
                img.src = iconUrl;
                img.alt = network.name;
                link.appendChild(img);
            }

            listItem.appendChild(link);
            socialNetworksList.appendChild(listItem);
        });
    }

    if (companyData.image) {
        logoImage.src = companyData.image;
    }

    if (companyData.name) {
        companyName.textContent = companyData.name;
    }

    if (companyData.description) {
        companyDescription.textContent = companyData.description;
    }
}
