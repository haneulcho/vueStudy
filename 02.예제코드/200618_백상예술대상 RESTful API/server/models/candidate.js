const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
	CANDIDATE_ID: { type: String },
	PROGRAM_NM: { type: String, required: true },
	AWARD_NUM: { type: Number, required: true, default: 56 },
	PRIZE_CD: { type: String, required: true },
	DIVISION: { type: String, required: true },
	NAME: { type: String },
	PRIZE_NM: { type: String },
	PHOTO_URI: { type: String }
});

const Candidate = mongoose.model('Candidate', CandidateSchema);

module.exports = Candidate;
