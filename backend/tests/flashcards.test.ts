import request from 'supertest'; // ✅ supertest import
import { describe, it } from 'mocha';
import { expect } from 'chai';
import {app} from '../src/server'; // your Express app

/**
 * @spec.requires The server must be running and connected to Supabase with valid environment variables.
 */

describe('Flashcard API', () => {

    /**
   * @spec.requires GET /api/flashcards should return all flashcards.
   */
  it('should fetch all flashcards', async () => {
    const res = await request(app).get('/api/flashcards');
    
    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
  });
});

describe('POST /api/flashcards', () => {

    /**
    * Returns 201 status, success = true, and created flashcard data.
   * @spec.requires POST /api/flashcards with valid data should create a flashcard.
   */
  it('should create a flashcard successfully', async () => {
    const res = await request(app)
      .post('/api/flashcards')
      .send({
        front: 'What is the capital of France?',
        back: 'Paris',
        hint: 'It\'s a famous city of love',
        tags: ['geography', 'capital']
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.have.property('id');
    expect(res.body.data.front).to.equal('What is the capital of France?');
    expect(res.body.data.back).to.equal('Paris');
  });

    /**
   * Returns 400 status and appropriate error message.
   * @spec.requires POST /api/flashcards without "back" field should fail.
   */
  it('should fail when back is missing', async () => {
    const res = await request(app)
      .post('/api/flashcards')
      .send({
        front: 'Incomplete card',
        hint: 'Missing back side',
        tags: ['test']
      });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.equal(false);
    expect(res.body.error).to.equal('back of flashcard are required');
  });

    /**
   * Creates flashcard with empty tags array.
   * @spec.requires POST /api/flashcards with only front and back should succeed.
   */
  it('should create flashcard without context (no hint, no tags)', async () => {
    const res = await request(app)
      .post('/api/flashcards')
      .send({
        front: 'What is 2+2?',
        back: '4'
        // hint and tags are optional
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.equal(true);
    expect(res.body.data.front).to.equal('What is 2+2?');
    expect(res.body.data.back).to.equal('4');
    expect(res.body.data.tags).to.deep.equal([]);
  });

});