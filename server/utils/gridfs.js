const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");
const { BSON } = require("bson");

let gridFSBucket;

const initGridFS = (db) => {
  //   console.log("14. Initializing GridFS bucket");
  gridFSBucket = new GridFSBucket(db, {
    bucketName: "fractalImages",
    bson: BSON,
  });
  //   console.log("15. GridFS bucket initialized:", !!gridFSBucket);
};

const uploadFile = async (buffer, filename, contentType) => {
  return new Promise((resolve, reject) => {
    // Create a readable stream from the buffer
    const readableStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });

    const uploadStream = gridFSBucket.openUploadStream(filename, {
      contentType: contentType,
      chunkSizeBytes: 255 * 1024, // Set chunk size to 255KB
    });

    readableStream
      .pipe(uploadStream)
      .on("finish", () => {
        resolve(uploadStream.id);
      })
      .on("error", reject);
  });
};

const downloadFile = async (fileId) => {
  //   console.log("8. Starting GridFS download for fileId:", fileId);

  if (!gridFSBucket) {
    // console.error("9. ERROR: GridFS bucket not initialized!");
    throw new Error("GridFS not initialized");
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    // console.log("10. Creating download stream...");
    const downloadStream = gridFSBucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    downloadStream.on("data", (chunk) => {
      //   console.log("11. Received chunk of size:", chunk.length);
      chunks.push(chunk);
    });

    downloadStream.on("error", (err) => {
      console.error("12. ERROR in download stream:", {
        error: err,
        message: err.message,
        stack: err.stack,
      });
      reject(err);
    });

    downloadStream.on("end", () => {
      //   console.log("13. Download stream ended, total chunks:", chunks.length);
      resolve(Buffer.concat(chunks));
    });
  });
};

module.exports = {
  initGridFS,
  uploadFile,
  downloadFile,
};
