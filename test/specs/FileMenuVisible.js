import { browser } from '@wdio/globals'
import { expect } from 'chai';

describe('Electron Testing', () => {
    it('should print application title', async () => {
        console.log('Hello', await browser.getTitle(), 'application!')
    })
})

describe('Button Testing', () => {
    it('should display the File menu button', async () => {
        // Navigujte na stránku iba pred týmto testom
        await browser.url('http://localhost:3000'); // Zmeňte na URL vašej aplikácie

        // Nájdenie tlačidla "File menu"
        const fileMenuButton = await $('button[aria-label="File menu"]');
        const isDisplayed = await fileMenuButton.isDisplayed();

        // Očakávame, že tlačidlo bude zobrazené
        expect(isDisplayed).to.be.true;
    });

});
