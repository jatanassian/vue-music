describe('Audio Player', () => {
  it('plays audio', () => {
    cy.visit('/');

    cy.get('[data-cy="song-name"]').first().click();
    cy.get('[data-cy="play-button"]').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.get('[data-cy="player-button"]').click();
  });
});
