const router = require("express-promise-router")();
const userController = require("../controllers/user.controller");
const publicacaoController = require("../controllers/publicacao.controller");
const comentarioController = require("../controllers/comentario.controller");
const favoritoController = require("../controllers/favoritos.controller");
const friendsController = require("../controllers/solicitacoes.controller");
const amigosController = require("../controllers/friends.controller");
const middleware = require("../middleware/middleware");

router.post("/user/cadastro", userController.createUser);
router.post("/user/login", userController.login);
router.put("/user/update", middleware.verifyJWT, userController.updateUser);
router.get("/user/user/:id", middleware.verifyJWT, userController.getUser);
router.get(
  "/user/username/:username",
  middleware.verifyJWT,
  userController.getUserByUsername
);
router.get("/user/session", middleware.verifyJWT, userController.getSession);
router.post("/user/logout", middleware.verifyJWT, userController.logout);
router.put(
  "/user/senha/:username",
  middleware.verifyJWT,
  userController.updateSenha
);
router.delete(
  "/user/delete/:username",
  middleware.verifyJWT,
  favoritoController.deleteLikes,
  comentarioController.deleteComentarios,
  friendsController.deleteSolicitacoes,
  amigosController.deleteFriends,
  publicacaoController.deletePublicacoes,
  userController.deleteConta
);
router.post(
  "/post/postar",
  middleware.verifyJWT,
  publicacaoController.createPublicacao
);
router.get(
  "/post/publicacoes/:username",
  middleware.verifyJWT,
  publicacaoController.getPublisFromUser
);
router.post(
  "/post/likes",
  middleware.verifyJWT,
  publicacaoController.getPublisFromId
);
router.put(
  "/post/comentarios/:id",
  middleware.verifyJWT,
  publicacaoController.updateComment
);
router.put(
  "/post/likes/:id",
  middleware.verifyJWT,
  publicacaoController.updateLikeMais
);
router.post(
  "/coment/comentario",
  middleware.verifyJWT,
  comentarioController.createComentario
);
router.get(
  "/coment/coments/:idPubli",
  middleware.verifyJWT,
  comentarioController.getPubliComents
);
router.post(
  "/fav/add/:idPubli",
  middleware.verifyJWT,
  favoritoController.createFavorite
);
router.delete(
  "/fav/delete/:idPubli/:username",
  middleware.verifyJWT,
  favoritoController.deleteFavorite
);
router.get(
  "/fav/get/:username",
  middleware.verifyJWT,
  favoritoController.getLikes
);
router.get(
  "/fav/getNumLikes/:idPubli",
  middleware.verifyJWT,
  favoritoController.getLikesFromIdPubli
);
router.post(
  "/friends/solicitacao/:from/:to",
  middleware.verifyJWT,
  friendsController.sendSolicitacao
);
router.get(
  "/friends/solicitacoes/:to",
  middleware.verifyJWT,
  friendsController.getSolicitacoes
);
router.put(
  "/friends/solicitacao/:from",
  middleware.verifyJWT,
  friendsController.updateSolicitacao
);
router.put(
  "/post/like/:id",
  middleware.verifyJWT,
  publicacaoController.updateLikeMais
);
router.put(
  "/post/like-delete/:id",
  middleware.verifyJWT,
  publicacaoController.updateLikeMenos
);
router.post(
  "/friendsTable/friend",
  middleware.verifyJWT,
  amigosController.sendFriend
);
router.get(
  "/friendsTable/friends/:username",
  middleware.verifyJWT,
  amigosController.getFriends
);
router.get(
  "/friends/friends/:to",
  middleware.verifyJWT,
  friendsController.getFriends
);
router.delete(
  "/post/delete/:id",
  middleware.verifyJWT,
  comentarioController.deleteComentario,
  favoritoController.deleteLike,
  publicacaoController.deletePublicacao
);
module.exports = router;
