describe("Audio Player", () => {
  it("plays audio", () => {
    cy.visit("/");
    cy.get(".cypress-song-item:first").click();
    cy.get("#cypress-play-btn").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.get("#cypress-player-play-btn").click();
  });
});
