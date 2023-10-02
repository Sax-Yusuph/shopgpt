import { Pipeline, pipeline } from "@xenova/transformers";

// Use the Singleton pattern to enable lazy construction of the pipeline.
// NOTE: We wrap the class in a function to prevent code duplication (see below).
function P() {
  return class PipelineSingleton {
    static task = "feature-extraction";
    static model = "Supabase/gte-small";
    static instance: Promise<Pipeline>;
    static progress = 0;

    static async getInstance() {
      if (!this.instance) {
        this.instance = pipeline(this.task, this.model, {
          progress_callback: (p: number) => {
            this.progress = p;
          },
        });
        console.log("instance is null");
      }

      return this.instance;
    }

    static async transform(userMessage: string) {
      const instance = await this.getInstance();

      const result = await instance(userMessage, {
        pooling: "mean",
        normalize: true,
      });

      return Array.from(result.data);
    }
  };
}

const PipelineSingleton = P();

export default PipelineSingleton;
