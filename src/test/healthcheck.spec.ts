import { Done } from "mocha";
import request from "supertest";
import app from "../app";

// Test suite
describe('Testing to check health', function() {
    // Test case
    it('Should handle a request to check health', function(done: Done) {
        request(app)
            .get('/api/v1/healthcheck')
            .expect(200)
            .end((error: Error | null, response: request.Response) => {
                if (error) {
                    done(error);
                } else {
                    const res = response.text;
                    res.should.not.equal(null, 'response should contain a text message');
                    res.should.equal('API is up and running', 'Should return working message');
                    done();
                }
            });
    });
});
