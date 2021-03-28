using Newtonsoft.Json;

namespace Editor
{
    class Midi
    {
        [JsonProperty("syllable")]public string syllable;
        [JsonProperty("note")]public string note;
        [JsonProperty("duration")]public int duration;
        [JsonProperty("order")]public int order;
        
        public Midi()
        {
            syllable = note = "";
            duration = order = 0;
        }
    }
}