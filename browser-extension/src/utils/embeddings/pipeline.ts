import { Pipeline, env, pipeline } from '@xenova/transformers'

env.backends.onnx.wasm.numThreads = 1
type LoadProgress = {
  status: 'progress' | 'done' | 'ready'
  progress: number
  loaded: number
  total: number
  name: 'Supabase/gte-small'
  file: 'onnx/model_quantized.onnx'
}

type cb = (value: LoadProgress) => void
// Use the Singleton pattern to enable lazy construction of the pipeline.
// NOTE: We wrap the class in a function to prevent code duplication (see below).
function P() {
  return class PipelineSingleton {
    static task = 'feature-extraction'
    static model = 'Supabase/gte-small'
    static instance: Promise<Pipeline>

    static async getInstance(progress_callback?: cb) {
      if (!this.instance) {
        this.instance = pipeline(this.task, this.model, {
          progress_callback,
        })
      }

      return this.instance
    }

    static async transform(userMessage: string) {
      const instance = await this.getInstance()

      const result = await instance(userMessage, {
        pooling: 'mean',
        normalize: true,
      })

      return Array.from(result.data)
    }
  }
}

const PipelineSingleton = P()

export default PipelineSingleton
