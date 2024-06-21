const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const User = require('../models/user');
const { jwtAuthMidlleware, generateToken } = require('../jwt');

//check admin role

const checkADminRole = async(userId) => {
    try {
        const user = await User.findById(userId);
        if (user.role == 'admin')
            return true;
    } catch (error) {
        return false;
    }
}

//post roue to add a candidate
router.post('/', jwtAuthMidlleware, async(req, res) => {
    try {
        if (!await checkADminRole(req.user.id))
            return res.status(403).json({ message: 'user dont have admin role' })

        const data = req.body; //assuming the request body contains the Candidate data

        //create a new Candidate document using mongoose
        const newCandidate = new Candidate(data);


        //save to database
        const response = await newCandidate.save();
        console.log('data saved');



        res.status(200).json({ response: response });


    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });

    }
})





//update admin
router.put('/:candidateId', jwtAuthMidlleware, async(req, res) => {
    try {
        if (!checkADminRole(req.user.id))
            return res.status(403).json({ message: 'user dont have admin role' })
                //extract the id from url parameter
        const candidateId = req.params.candidateId;

        const response = await person.findByIdAndUpdate(candidateId, updatedCandidateData, {
            new: true,
            runValidators: true
        });
        if (!response) {
            return res.status(404).json({ error: 'candidate not found' });
        }
        console.log("candidate data updated");
        res.status(200).json(response);


    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
})

//delete admin
router.delete('/:candidateId', jwtAuthMidlleware, async(req, res) => {
    try {
        if (!checkADminRole(req.user.id))
            return res.status(403).json({ message: 'user dont have admin role' })
                //extract the id from url parameter
        const candidateId = req.params.candidateId;
        const updatedCandidateData = req.body;
        const response = await person.findByIdAndDelete(candidateId);
        if (!response) {
            return res.status(404).json({ error: 'candidate not found' });
        }
        console.log("candidate data deleted");
        res.status(200).json(response);


    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
})

//lets start voting
router.post('/vote/:candidateId', jwtAuthMidlleware, async(req, res) => {
    //no admin can vote
    //user can only vote once
    candidateId = req.params.candidateId;
    userId = req.user.id;
    try {
        //find the candidate document using candidate id
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: 'candidate not found' });
        }
        //find the user using the user id
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        //if user had already voted
        if (user.isVoted) {
            return res.status(400).json({ message: 'user had already voted' });
        }
        //if user is admin so admin cant vote
        if (user.role == 'admin') {
            return res.status(403).jason({ message: 'admin can not vote' });
        }
        //update the candidate document to record the vote
        candidate.votes.push({ user: userId });
        candidate.voteCount++;
        await candidate.save();
        //update the user document
        user.isVoted = true;
        await user.save();
        //vote recorded succesfully
        return res.status(200).json({ message: 'vote recorded successfully' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
})

//vote count
router.get('/vote/count', async(req, res) => {
    try {
        //Find all candidate and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({ voteCount: 'desc' });

        //map the candidate to only return their name and votecout
        const voteRecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);


    } catch (error) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
})

//finding list of candidates
router.get('/candidate', async(req, res) => {
    try {
        //list of candidates
        const candidateList = await Candidate.find({}, { _id: 0, name: true });
        return res.status(200).json(candidateList);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
})






module.exports = router;