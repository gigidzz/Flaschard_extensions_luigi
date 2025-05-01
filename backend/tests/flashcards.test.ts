import request from 'supertest'; 
import { describe, it } from 'mocha';
import { expect } from 'chai';
import {app} from '../src/server'; 
import { Flashcard } from '../src/logic/flashcard';

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
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.equal(true);
    expect(res.body.data.front).to.equal('What is 2+2?');
    expect(res.body.data.back).to.equal('4');
    expect(res.body.data.tags).to.deep.equal([]);
  });
});

/**
 * @spec.requires The server must support deleting flashcards by ID via DELETE /api/flashcard/:id.
 */

describe('DELETE /api/flashcard/:id', () => {

/**
 * @spec.requires A valid flashcard must exist before deletion.
 * @spec.ensures Flashcard is deleted successfully and server returns 200 with success = true.
 */
  it('should delete a flashcard successfully', async () => {
    // First create a flashcard to delete
    const createRes = await request(app)
      .post('/api/flashcards')
      .send({
        front: 'Temporary Flashcard',
        back: 'To be deleted',
        hint: 'Temporary',
        tags: ['temporary', 'test']
      });

    expect(createRes.status).to.equal(201);
    expect(createRes.body.success).to.be.true;

    const createdId = createRes.body.data.id;

    // Now delete the flashcard
    const deleteRes = await request(app)
      .delete(`/api/flashcard/${createdId}`);

    expect(deleteRes.status).to.equal(200);
    expect(deleteRes.body.success).to.be.true;
    expect(deleteRes.body.message).to.equal('Flashcard deleted successfully');
  });


});

/**
 * @spec.requires The server must be running and connected to Supabase with valid environment variables.
 */
describe('Flashcard API', () => {
    /**
   * @spec.requires GET /api/flashcards/practice should return flashcards with points less than 5.
   */
    it('should fetch flashcards with points less than 5', async () => {
      const res = await request(app).get('/api/flashcards/practice');
      
      console.log(res, 'restoranis')
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an('array');
      
      // Check that all returned flashcards have points less than 5
      res.body.data.forEach((card:Flashcard) => {
        expect(card.point).to.be.lessThan(5);
      });
    });
});

/**
 * @spec.requires The server must support updating flashcard difficulty and points via PATCH /api/flashcards/update-difficulty.
 */
describe('PATCH /api/flashcards/update-difficulty', () => {
  /**
   * @spec.requires A valid flashcard must exist before updating.
   * @spec.ensures Flashcard difficulty level and points are updated successfully.
   * @spec.ensures Points are incremented based on difficulty level (easy: +2, hard: +1, wrong: +0).
   */
  it('should update flashcard difficulty and points successfully', async () => {
    try {
      // First create a flashcard to update
      const createRes = await request(app)
        .post('/api/flashcards')
        .send({
          front: 'What is TypeScript?',
          back: 'A superset of JavaScript that adds static typing',
          hint: 'Programming language',
          tags: ['programming', 'web development']
        });


      expect(createRes.status).to.equal(201);
      expect(createRes.body.success).to.be.true;

      const createdId = createRes.body.data.id;
      
      // Get the initial state to verify the points correctly
      const initialGet = await request(app).get(`/api/flashcard/${createdId}`);
      const initialPoints = initialGet.body.data.point || 0;

      // Now update the flashcard difficulty to 'easy' (should add 2 points)
      const updateRes = await request(app)
        .patch('/api/flashcards/update-difficulty')
        .send({
          id: createdId,
          difficulty_level: 'easy'
        });

      // Check if update was successful
      expect(updateRes.status).to.equal(200);
      expect(updateRes.body.success).to.be.true;
      expect(updateRes.body.data.difficulty_level).to.equal('easy');
      expect(updateRes.body.data.point).to.equal(initialPoints + 2);
      expect(updateRes.body.message).to.equal('Flashcard updated successfully');
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    }
  });

  /**
   * @spec.requires A valid flashcard must exist before updating.
   * @spec.ensures The hard difficulty adds 1 point to the flashcard.
   */
  it('should update flashcard to hard difficulty and add 1 point', async () => {
    // First create a flashcard to update
    const createRes = await request(app)
      .post('/api/flashcards')
      .send({
        front: 'What is Node.js?',
        back: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine',
        tags: ['programming', 'backend']
      });

    expect(createRes.status).to.equal(201);
    expect(createRes.body.success).to.be.true;
    
    const createdId = createRes.body.data.id;
    
    // Get the initial state to verify the points correctly
    const initialGet = await request(app).get(`/api/flashcard/${createdId}`);
    const initialPoints = initialGet.body.data.point || 0;

    // Update the flashcard difficulty to 'hard' (should add 1 point)
    const updateRes = await request(app)
      .patch('/api/flashcards/update-difficulty')
      .send({
        id: createdId,
        difficulty_level: 'hard'
      });

    expect(updateRes.status).to.equal(200);
    expect(updateRes.body.success).to.be.true;
    expect(updateRes.body.data.difficulty_level).to.equal('hard');
    expect(updateRes.body.data.point).to.equal(initialPoints + 1);
  });

  /**
   * @spec.requires A valid flashcard must exist before updating.
   * @spec.ensures The wrong difficulty doesn't add any points to the flashcard.
   */
  it('should update flashcard to wrong difficulty and add 0 points', async () => {
    // First create a flashcard to update
    const createRes = await request(app)
      .post('/api/flashcards')
      .send({
        front: 'What is Express?',
        back: 'A web application framework for Node.js',
        hint: 'Popular backend framework',
        tags: ['programming', 'backend']
      });

    expect(createRes.status).to.equal(201);
    expect(createRes.body.success).to.be.true;

    const createdId = createRes.body.data.id;
    
    // Get the initial state to verify the points correctly
    const initialGet = await request(app).get(`/api/flashcard/${createdId}`);
    const initialPoints = initialGet.body.data.point || 0;

    // Update the flashcard difficulty to 'wrong' (should add 0 points)
    const updateRes = await request(app)
      .patch('/api/flashcards/update-difficulty')
      .send({
        id: createdId,
        difficulty_level: 'wrong'
      });

    expect(updateRes.status).to.equal(200);
    expect(updateRes.body.success).to.be.true;
    expect(updateRes.body.data.difficulty_level).to.equal('wrong');
    expect(updateRes.body.data.point).to.equal(initialPoints); // Points remain the same
  });

  /**
   * @spec.requires Invalid parameters should return appropriate error.
   * @spec.ensures Returns 400 status and error message for invalid inputs.
   */
  it('should return error for invalid difficulty level', async () => {
    // Create a test flashcard first
    const createRes = await request(app)
      .post('/api/flashcards')
      .send({
        front: 'Test card',
        back: 'For invalid difficulty test'
      });

    expect(createRes.status).to.equal(201);
    const createdId = createRes.body.data.id;

    // Now try to update with invalid difficulty
    const updateRes = await request(app)
      .patch('/api/flashcards/update-difficulty')
      .send({
        id: createdId,
        difficulty_level: 'medium' // Invalid value not in ['easy', 'hard', 'wrong']
      });

    expect(updateRes.status).to.equal(400);
    expect(updateRes.body.success).to.be.false;
    expect(updateRes.body.message).to.include('Invalid request');
  });

  /**
   * @spec.requires Non-existent flashcard ID should return appropriate error.
   * @spec.ensures Returns error message for non-existent flashcard.
   */
  it('should return error for non-existent flashcard ID', async () => {
    const nonExistentId = 9999; // Assuming this ID doesn't exist

    const updateRes = await request(app)
      .patch('/api/flashcards/update-difficulty')
      .send({
        id: nonExistentId,
        difficulty_level: 'easy'
      });

    expect(updateRes.status).to.equal(500);
    expect(updateRes.body.success).to.be.false;
  });
});