import { browser } from '@wdio/globals';
import { expect } from 'chai';

describe('Test menu item functionality', () => {
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
        const menuItem = await $(`//span[text()="Import From Clipboard"]`);
        await menuItem.waitForExist();
        expect(await menuItem.isExisting()).to.be.true;
        await menuItem.click();

        const dialog = await $('div[role="dialog"]'); // Selektor tlačidla
        await dialog.waitForExist();
        expect(await dialog.isExisting()).to.be.true;

        const closebttn = await $('button[aria-label="close"]'); // Selektor tlačidla
        await closebttn.waitForExist();
        expect(await closebttn.isExisting()).to.be.true;
        await closebttn.click();
        await dialog.waitForExist({ reverse: true }); // Čakáme, kým dialog zmizne
        expect(await dialog.isExisting()).to.be.false;


    });
});