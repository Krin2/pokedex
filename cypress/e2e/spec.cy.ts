describe('empty spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })

  describe('visit pokedex page', () => {
    it('passes', () => {
      cy.visit('http://localhost:3000/api/v2')
  
    })
  })
})
