import { browser } from '@wdio/globals'
import { expect } from 'chai';


describe('File menu button functionality', () => {
    it('should open the File menu when the button is clicked', async () => {
        // Otvorenie aplikácie
        await browser.url('http://localhost:3000');

        // Nájdeme tlačidlo File menu
        const fileMenuButton = await $('button[aria-label="File menu"]'); // Pridajte správny selektor

        // Skontrolujeme, či tlačidlo existuje
        // await expect(fileMenuButton).toBeExisting();
        await fileMenuButton.waitForExist();
        expect(await fileMenuButton.isExisting()).to.be.true;

        // Klikneme na tlačidlo
        await fileMenuButton.click();

        // Skontrolujeme, či sa zobrazí menu
        const fileMenu = await $('ul[role="menu"]'); // Pridajte správny selektor
        await fileMenu.waitForExist();
        expect(await fileMenu.isExisting()).to.be.true;
    });
});