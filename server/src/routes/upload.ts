import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { extname, resolve } from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pump = promisify(pipeline);

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", async (request, reply) => {
    const fileToUpload = await request.file({
      limits: {
        fileSize: 5242880, //5mb
      },
    });

    if (!fileToUpload) {
      return reply.status(400).send("Nenhum arquivo foi selecionado");
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/;
    const isValidFileFormat = mimeTypeRegex.test(fileToUpload.mimetype);

    if (!isValidFileFormat) {
      return reply
        .status(400)
        .send(
          "Somente é permitido o envio de arquivos no formato imagem ou vídeo"
        );
    }

    const fileId = randomUUID();
    const fileExtension = extname(fileToUpload.filename);

    const fileName = fileId.concat(fileExtension);

    const writeStream = createWriteStream(
      resolve(__dirname, "..", "..", "uploads", fileName)
    );

    await pump(fileToUpload.file, writeStream);

    const applicationUrl = request.protocol
      .concat("://")
      .concat(request.hostname);
    const fileUrl = new URL(`/uploads/${fileName}`, applicationUrl).toString();

    return { fileUrl };
  });
}
