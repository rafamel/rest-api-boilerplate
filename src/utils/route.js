import { Router } from 'express';

export default function route(cb) {
  const router = Router();
  cb(router);
  return router;
}
