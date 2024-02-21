const router = require("express").Router();
const Player = require("../models/quiz_player.cjs");
const jwt = require("jsonwebtoken");

//Submit
router.post("/quiz_player/new", async (req, res) => {
  const { username } = req.body;
  try {
    const newPlayer = new Player({
      username: username,
    });
    const player = await newPlayer.save();
    res.json({ _id: player._id, username: player.username });
  } catch (err) {
    res.send(err);
  }
});

router.get("/quiz_player/player/:id", (req, res) => {
  const playerId = req.params.id;
  try {
    Player.findById(playerId).then((player) => {
      if (!player) {
        res.json({ player: null });
      }
      if (player) {
        const tokenId = player._id;
        const token = jwt.sign({ tokenId }, process.env.JWT_SECRET);
        const { createdAt, ...details } = player._doc;
        res.json({ details, token: token });
      }
    });
  } catch (err) {
    res.send(err);
  }
});

const verifyAuth = (req, res, next) => {
  const token = req.headers["quiz-token"];

  if (!token) {
    res.json({ authenticated: false });
  }
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          res.json({ authenticated: false, error });
        }
        if (decoded) {
          const userId = decoded.tokenId;
          res.locals.id = userId;
          next();
        }
      });
    } catch (error) {
      res.json({ authenticated: false, error });
    }
  }
};

router.post("/quiz_player/auth", verifyAuth, async (req, res) => {
  const id = res.locals.id;
  try {
    await Player.findById(id).then((player) => {
      if (!player) {
        res.json({ authenticated: false });
      }
      if (player) {
        const { createdAt, ...details } = player._doc;
        res.json({ authenticated: true, details });
      }
    });
  } catch (error) {
    res.json(error);
  }
});

router.get("/quiz_player/players/all", (req, res) => {
  try {
    Player.find()
      .sort({ createdAt: "descending" })
      .then((players) => {
        res.send(players);
      });
  } catch (err) {
    res.send(err);
  }
});

router.get("/quiz_player/time_stamp/:id", (req, res) => {
  const playerId = req.params.id;
  try {
    Player.findById(playerId).then((player) => {
      if (player) {
        res.json({ timeStamp: player.timeStamp });
      }
      if (!player) {
        res.json({ timeStamp: null });
      }
    });
  } catch (error) {
    res.json(error);
  }
});

router.put("/quiz_player/update/:id", (req, res) => {
  const playerId = req.params.id;
  const { points, correctQuizIds, incorrectQuizIds } = req.body;
  try {
    Player.updateOne(
      { _id: playerId },
      {
        $inc: { points: points },
        $push: {
          correctQuizzes: { $each: correctQuizIds },
          incorrectQuizzes: { $each: incorrectQuizIds },
        },
        $set: { completed: true, timeStamp: Date.now() },
      }
    ).then((player) => {
      res.json({ ...player, success: true });
    });
  } catch (error) {
    res.json(error);
  }
});

router.get("/quiz_player/points/:id", (req, res) => {
  const playerId = req.params.id;
  try {
    Player.findById(playerId).then((player) => {
      if (player) {
        res.json({ points: player.points });
      }
      if (!player) {
        res.json({ points: null });
      }
    });
  } catch (error) {
    res.json(error);
  }
});

router.get("/quiz_player/players/points", (req, res) => {
  try {
    Player.aggregate([{ $project: { points: 1, username: 1, _id: 0 } }])
      .sort({ points: "descending" })
      .then((points) => {
        if (points) {
          res.send(points);
        }
        if (!points) {
          res.json({ points: null });
        }
      });
  } catch (error) {
    res.json(error);
  }
});

router.get("/quiz_player/rank/:id", async (req, res) => {
  const playerId = req.params.id;
  try {
    Player.aggregate([{ $project: { points: 1 } }]).then((points) => {
      if (points) {
        const sortedPoints = points.sort((a, b) => b.points - a.points);
        const pointIndex = sortedPoints.findIndex((p) => p._id == playerId);
        const playerRank = pointIndex + 1;
        res.json({ rank: playerRank });
      }
      if (!points) {
        res.json({ rank: null });
      }
    });
  } catch (error) {
    res.send(error);
  }
});

router.put("/quiz_player/completed/:id", async (req, res) => {
  const playerId = req.params.id;
  try {
    await Player.findOne({ _id: playerId }).then((player) => {
      if (player.completed) {
        Player.updateOne(
          { _id: playerId },
          {
            $set: { completed: false },
          }
        ).then((player) => {
          res.json({ ...player, success: true });
        });
      }
      if (!player.completed) {
        Player.updateOne(
          { _id: playerId },
          {
            $set: { completed: true },
          }
        ).then((player) => {
          res.json({ ...player, success: true });
        });
      }
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
