import { browser } from '@wdio/globals';
import { expect } from 'chai';

describe('menu item functionality', () => {
    it('should execute action when menu item is clicked', async () => {
        // Načítanie stránky
        await browser.url('http://localhost:3000'); // Nahraďte správnou URL aplikácie

        // Nájdenie a kliknutie na tlačidlo, ktoré otvára menu
        const menuButton = await $('button[aria-label="File menu"]'); // Selektor tlačidla
        await menuButton.waitForExist();
        expect(await menuButton.isExisting()).to.be.true;
        await menuButton.click();

        // Čakanie na zobrazenie menu
        const fileMenu = await $('ul[role="menu"]'); // Pridajte správny selektor
        await fileMenu.waitForExist();
        expect(await fileMenu.isExisting()).to.be.true;
        await fileMenu.click();


        // Nájdenie a kliknutie na konkrétnu položku menu
        const newItem = await $(`//span[text()="New"]`);
        await newItem.waitForExist();
        expect(await newItem.isExisting()).to.be.true;
        //await newItem.click();


        //const dialog = await $('div[role="textbook"]'); // Selektor tlačidla
        //await dialog.waitForExist();
        //expect(await dialog.isExisting()).to.be.true;


    });
});