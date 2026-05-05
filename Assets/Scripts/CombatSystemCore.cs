using UnityEngine;

public class CombatSystemCore : MonoBehaviour
{
    public int ammo = 30;

    public void UseAmmo(int amount = 1)
    {
        ammo = Mathf.Max(0, ammo - amount);
        UIManager.UpdateAmmo(ammo);
    }

    public void Reload(int amount)
    {
        ammo += amount;
        UIManager.UpdateAmmo(ammo);
    }
}
