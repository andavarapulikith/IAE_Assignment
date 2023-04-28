const faq_model = require('../models/faq_model');
const expert_model = require('../models/expert');

exports.askquery=(req, res) => {
    const registeras = req.session.registeras;

    const is_blocked = req.session.is_blocked;
    let is_solved = req.query.is_solved;
    is_solved = (is_solved == 'true');
    // console.log(is_solved);
    faq_model.find({ is_answered: is_solved }).then((faq_data) => {
        res.render('askquery', { 'faq_data': faq_data, 'registeras': registeras,'is_answered':is_solved,is_blocked:is_blocked });
    }).catch((err) => {
        console.log(err);
    })
}

exports.postaskquery=(req, res) => {

    const user_id = req.session.profile_data;
    const { topic, question } = req.body;
    const question_details = {
        user_id: user_id,
        topic: topic,
        question: question
    }
    const newFaq = new faq_model(question_details);
    newFaq.save().then(() => {
        // console.log('faq posted...');
        res.redirect('/askquery?is_solved=true');
    }).catch((err) => {
        console.log(err);
    })
}

exports.postfilter=async(req, res) => {

    // console.log(req.body);


    const id = req.session.profile_data;
    let { is_solved, all_or_your,search_value,choose_topic } = req.body;
    let faq_data = [];
    const registeras = req.session.registeras;
    is_solved = is_solved == 'true';

    faq_data = await faq_model.find({ is_answered: is_solved });

    if (all_or_your == 'your') {
        faq_data = faq_data.filter((ques) => {
             return ques.user_id == id;
        });
    }
    else if (all_or_your == 'answered') {
        faq_data = faq_data.filter((ques) => {
            return ques.expert_id == id;
        });
    }

    if (search_value != ""){
        faq_data = faq_data.filter((ques) => {
            return ques.question.toLowerCase().includes(search_value.toLowerCase());
        });
    }

    if (choose_topic != "") {
        faq_data = faq_data.filter((ques) => {
            return ques.topic.toLowerCase() == choose_topic;
        });
    }

    res.render('askquery', { 'faq_data': faq_data, 'registeras': registeras, 'is_answered': is_solved, is_blocked: req.session.is_blocked });

}


exports.answerquery=(req, res) => {
    const question_id = req.params.question_id;
    const exp_id = req.session.profile_data;
    const answer = req.body['faq-solution'];
    expert_model.findOne({ _id: exp_id }).then((data) => {
        const profile_image_link = data['profile_image_link'];
        faq_model.updateOne(
            { _id: question_id },
            { $set: { is_answered: true, expert_id: exp_id, "profile-image-link": profile_image_link,answer:answer } }
        ).then(() => {
            // console.log('solution added succesfully');
            res.redirect('/askquery?is_solved=true');
        })
            .catch((err) => {
                console.error(err);
            });

    }).catch((err) => {
        console.log(err);
    });

}