using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Video;

public class PoemDisplayManager : MonoBehaviour
{
    public static VideoPlayer[] effects;
    public static RawImage displayPlane;
    
    public VideoPlayer[] myEffects;
    public RawImage myDisplay;
    void Start()
    {
        effects = myEffects;
        displayPlane = myDisplay;
        displayPlane.enabled = false;
    }
    
    void Update()
    {
        
    }
}
