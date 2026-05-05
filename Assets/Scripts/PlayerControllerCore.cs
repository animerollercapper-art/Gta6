using UnityEngine;

public class PlayerControllerCore : MonoBehaviour
{
    public float speed = 5f;
    public float rotateSpeed = 200f;
    public int health = 100;

    private Rigidbody rb;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        if (rb == null)
        {
            Debug.LogWarning("PlayerControllerCore requires a Rigidbody component.");
        }
    }

    void Update()
    {
        Move();
    }

    void Move()
    {
        if (rb == null) return;

        float moveInput = Input.GetAxis("Vertical");
        float rotateInput = Input.GetAxis("Horizontal");

        Vector3 movement = transform.forward * moveInput * speed * Time.deltaTime;
        rb.MovePosition(rb.position + movement);

        Quaternion rotation = Quaternion.Euler(0f, rotateInput * rotateSpeed * Time.deltaTime, 0f);
        rb.MoveRotation(rb.rotation * rotation);
    }

    public void TakeDamage(int damage)
    {
        health -= damage;
        Debug.Log("Player Health: " + health);

        if (health <= 0)
        {
            Debug.Log("Player Died!");
            // TODO: Restart the game or show a game-over UI.
        }
    }
}
