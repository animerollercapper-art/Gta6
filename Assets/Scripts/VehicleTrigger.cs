using UnityEngine;

public class VehicleTrigger : MonoBehaviour
{
    public bool isPlayerInside;
    public string playerTag = "Player";
    private bool playerInRange;

    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag(playerTag))
        {
            playerInRange = true;
            Debug.Log("Player Near Vehicle. Press E to Enter.");
        }
    }

    void OnTriggerExit(Collider other)
    {
        if (other.CompareTag(playerTag))
        {
            playerInRange = false;
        }
    }

    void Update()
    {
        if (playerInRange && Input.GetKeyDown(KeyCode.E))
        {
            isPlayerInside = true;
            Debug.Log("Player Entered Vehicle");
        }
    }
}
