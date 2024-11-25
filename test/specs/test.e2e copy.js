import { browser } from '@wdio/globals'
import { expect } from 'chai';


describe('Application Title Testing', () => {
    it('should display the correct application title based on document head', async () => {
        // Predpokladáme, že stránka už bola načítaná
        await browser.url('http://localhost:3000'); // Zmeňte na URL vašej aplikácie

        // Overíme aktuálny titulok
        const title = await browser.getTitle();

        // Očakávaný titulok, ktorý je založený na dokumente (príklad)
        const expectedTitle = 'MaweJS'; // Alebo "* Document Title - MaweJS" ak je dokument špinavý

        // Očakávame, že titulok bude korešpondovať s očakávanou hodnotou
        expect(title).to.equal(expectedTitle);
    });
});