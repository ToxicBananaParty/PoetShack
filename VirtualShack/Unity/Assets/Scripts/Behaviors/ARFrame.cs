using System.Collections;
using System.Collections.Generic;
using System.Numerics;
using UnityEngine;
using UnityGoogleDrive.Data;
using Vector3 = UnityEngine.Vector3;

public class ARFrame : MonoBehaviour
{
    private float moveSpeed = .75f;
    private Vector3 oldPos, goalPos;
    void Start()
    {
        oldPos = transform.position;
        goalPos = oldPos + new Vector3(0f, Random.Range(-3.0f, -1.0f), 0f);
    }
    
    void FixedUpdate()
    {
        transform.position = Vector3.Slerp(transform.position, goalPos, moveSpeed * Time.deltaTime);
        if (Vector3.Distance(transform.position, goalPos) < 0.4f) {
            Vector3 intermediate = goalPos;
            goalPos = oldPos;
            oldPos = intermediate;
        }
    }
}
