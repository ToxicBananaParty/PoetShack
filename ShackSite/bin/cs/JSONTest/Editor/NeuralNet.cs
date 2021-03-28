using Newtonsoft.Json;

namespace Editor
{
    
    public class NeuralNet
    {
        [JsonProperty("tag_name")] public string result;
        [JsonProperty("tag_id")] public int id;
        [JsonProperty("confidence")] public double confidence;
        public NeuralNet()
        {
            
        }
    }
}