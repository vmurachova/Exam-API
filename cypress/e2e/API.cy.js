import post from "../fixtures/post.json"
import user from "../fixtures/user.json"
import { faker } from '@faker-js/faker'



describe('template spec', () => {
  user.email = faker.internet.email();
  let token;
  it(' 1. Get all posts. Verify HTTP response status code and content type.', () => {
    cy.request({
      method: 'GET',
      url: '/posts'
    }).then(response => {
      expect(response.status).equal(200);
      expect(response.headers['content-type']).equal('application/json; charset=utf-8');
    })
  })

  it('Get only first 10 posts. Verify HTTP response status code. Verify that only first posts are returned.', () => {
    cy.request({
      method: 'GET',
      url: '/posts'
    }).then(response => {
      expect(response.status).equal(200);
      expect(response.body[0].id).equal(1);
      expect(response.body[9].id).equal(10);
    })
  })

  it('2. Get posts with id = 55 and id = 60. Verify HTTP response status code. Verify id values of returned records.', () => {
    cy.request({
      method: 'GET',
      url: '/posts?id=55&id=60'
    }).then(response => {
      expect(response.status).equal(200);
      expect(response.body[0].id).equal(55);
      expect(response.body[1].id).equal(60);
    })
  })


  it('3. Create a post. Verify HTTP response status code.', () => {
    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: post,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).equal(401);
    })
  })

  it('5. Create post with adding access token in header. Verify HTTP response status code. Verify post is created..', () => {

    cy.request({
      method: 'POST',
      url: '/register',
      body: user
    }).then(response => {
      expect(response.status).equal(201);
      token = response.body.accessToken
    }).then(() => {
      cy.request({
        method: 'POST',
        url: '/664/posts',
        body: post,
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        expect(response.status).equal(201);
      })
    })
  })


  it('6. Create post entity and verify that the entity is created. Verify HTTP response status code. Use JSON in body.', () => {
    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: post,
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      expect(response.status).equal(201);
      cy.request({
        method: 'GET',
        url: `/posts?id=${response.body.id}`
      }).then(response => {
        expect(response.status).equal(200);
        expect(response.body[0].title).equal(post.title);
        expect(response.body[0].body).equal(post.body);
      })
    })
  })

  it('8.Create post entity and update the created entity. Verify HTTP response status code and verify that the entity is updated', () => {
    post.title = faker.lorem.sentence();
    post.body = faker.lorem.paragraph();
    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: post,
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      expect(response.status).equal(201);
      post.title = faker.lorem.sentence();
      post.body = faker.lorem.paragraph();
      cy.request({
        method: 'PUT',
        url: `/posts/${response.body.id}`,
        body: post
      }).then(response => {
        expect(response.status).equal(200);
        expect(response.body.title).equal(post.title);
        expect(response.body.body).equal(post.body)
      }).then(response => {
        cy.request({
          method: 'GET',
          url: `/posts?id=${response.body.id}`
        }).then(response => {
          expect(response.status).equal(200);
          expect(response.body[0].title).equal(post.title);
          expect(response.body[0].body).equal(post.body);
        })
      })
    })
  })

  it('9.Delete non-existing post entity. Verify HTTP response status code.', () => {
    cy.request({
      method: 'DELETE',
      url: '/posts/8967435',
      body: post,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).equal(404);
    })
  })

  it('10. Create post entity, update the created entity, and delete the entity. Verify HTTP response status code and verify that the entity is deleted.', () => {
    post.title = faker.lorem.sentence();
    post.body = faker.lorem.paragraph();
    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: post,
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      expect(response.status).equal(201);
      post.title = faker.lorem.sentence();
      post.body = faker.lorem.paragraph();
      cy.request({
        method: 'PUT',
        url: `/posts/${response.body.id}`,
        body: post
      }).then(response => {
        expect(response.status).equal(200);
        expect(response.body.title).equal(post.title);
        expect(response.body.body).equal(post.body)
      }).then(response => {
        cy.request({
          method: 'GET',
          url: `/posts?id=${response.body.id}`
        }).then(response => {
          expect(response.status).equal(200);
          expect(response.body[0].title).equal(post.title);
          expect(response.body[0].body).equal(post.body);
        }).then(respomce =>{
          cy.request({
            method: 'DELETE',
            url: `/posts/${response.body.id}`,
            body: post,
            headers: { Authorization: `Bearer ${token}` },
          }).then(response => {
            expect(response.status).equal(200);
          })
        })
      })
    })
  })

  


})