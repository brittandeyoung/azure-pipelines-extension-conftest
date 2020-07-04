import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Conftest Installer tests', function () {

    // before( function() {

    // });

    // after(() => {

    // });

    it('should succeed with simple inputs', function(done: MochaDone) {
      this.timeout(10000);

      let tp = path.join(__dirname, 'success.js');
      console.log(tp)
      let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
  
      tr.run();
      console.log(tr.succeeded);
      assert.equal(tr.succeeded, true, 'should have succeeded');
      assert.equal(tr.warningIssues.length, 0, "should have no warnings");
      assert.equal(tr.errorIssues.length, 0, "should have no errors");
      console.log(tr.stdout);
      done();
    });

    it('it should fail if version number is invalid', function(done: MochaDone) {
      this.timeout(10000);

      let tp = path.join(__dirname, 'failure.js');
      console.log(tp)
      let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
  
      tr.run();
      console.log(tr.succeeded);
      assert.equal(tr.succeeded, false, 'should have failed');
      assert.equal(tr.warningIssues, 0, "should have no warnings");
      assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
      assert.equal(tr.errorIssues[0], 'Error: loc_mock_InputVersionNotValidSemanticVersion 1', 'Invalid version number');
      // assert.equal(tr.stdout.indexOf('Hello bad'), -1, "Should not display Hello bad");
  
      done();
    });    
});