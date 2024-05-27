jsPsych.plugins['multi-slider'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'multi-slider',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        default: undefined,
        description: 'Array of questions with slider scales.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    var html = '<div id="jspsych-multi-slider-container">';

    for (var i = 0; i < trial.questions.length; i++) {
      var question = trial.questions[i];
      html += '<div class="jspsych-multi-slider-question" style="margin: 20px 0px;">';
      html += '<p>' + question.prompt + '</p>';
      html += '<input type="range" min="' + question.min + '" max="' + question.max + '" value="' + question.start + '" step="1" id="jspsych-multi-slider-' + i + '">';
      html += '<span id="jspsych-multi-slider-value-' + i + '">' + question.start + '</span>';
      html += '</div>';
    }

    html += '<button id="jspsych-multi-slider-next" class="jspsych-btn">Continue</button>';
    html += '</div>';

    display_element.innerHTML = html;

    // Add event listeners to update the slider values
    for (var i = 0; i < trial.questions.length; i++) {
      var slider_id = 'jspsych-multi-slider-' + i;
      var value_id = 'jspsych-multi-slider-value-' + i;
      document.getElementById(slider_id).addEventListener('input', function(event) {
        var id = event.target.id.split('-').pop();
        document.getElementById('jspsych-multi-slider-value-' + id).textContent = event.target.value;
      });
    }

    display_element.querySelector('#jspsych-multi-slider-next').addEventListener('click', function() {
      var responses = [];
      for (var i = 0; i < trial.questions.length; i++) {
        var slider_id = 'jspsych-multi-slider-' + i;
        var response = document.getElementById(slider_id).value;
        responses.push({
          question: trial.questions[i].prompt,
          response: response
        });
      }

      var trial_data = {
        responses: responses
      };

      display_element.innerHTML = '';

      jsPsych.finishTrial(trial_data);
    });
  };

  return plugin;
})();
