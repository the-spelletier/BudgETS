const { memberDTO } = require('../dto');
const memberService = require('../services/member');

function get(req, res) {
    memberService.getMember( req.params.id ).then(member => {
        member.userId = req.user.id;
        sendMember(member, res);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function getAll(req, res) {
    memberService.getMembers(req.user.id).then(members => {
        sendMember(members, res);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: 'An unexpected error occurred' });
    });
}

function create(req, res) {
    let member = memberDTO(req.body);
    member.userId = req.user.id;
    if (member.name && member.code && member.email) { 
        memberService.addMember(member).then(m => {
            res.status(201);
            sendMember(m, res);
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function update(req, res) {
    let member = memberDTO(req.body);
    member.userId = req.user.id;
    if (req.params.id) {
        member.id = req.params.id;
        memberService.updateMember(member).then(m => {
            sendMember(m, res);
        }).catch(err => {
            console.log(err);
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function deleteOne(req, res) {
    let member = memberDTO(req.params);
    if (member.id) {
        memberService.deleteMember(member).then(result => {
            if (result) {
                res.sendStatus(204);
            } else {
                res.status(404).send({ message: "Member Not Found" });
            }
        }).catch(err => {
            res.status(403).send({ message: 'Validation error' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function sendMember(member, res) {
    if (member) {
        let memberRes;
        if (Array.isArray(member)) {
            member.forEach((b, i, arr) => {
                arr[i] = memberDTO(b);
            });
            memberRes = member;
        } else {
            memberRes = memberDTO(member);
        }
        res.send(memberRes);
    } else {
        res.status(404).send({ message: "Member Not Found" });
    }
}

module.exports = {
    get,
    getAll,
    create,
    update,
    deleteOne
};