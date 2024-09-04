import axios from 'axios';

describe('Login Route testing!!', () => {
    test('should return a token for valid credentials', async () => {
        const response = await axios.post('https://s60-mohanavamsi-chayo.onrender.com/login', {
            email: 'mohanavamsi14@gmail.com',
            password: 'Vamsi0614!'
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('token');
    });

    test('should return 401 for invalid credentials', async () => {
        try {
            const response = await axios.post('https://s60-mohanavamsi-chayo.onrender.com/login', {
                email: 'mohanavamsi14@gmail.com',
                password: 'Vamsi061!'
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toHaveProperty('message', "Password is wrong");
        }
    });

    test('should return 404 for user not in database', async () => {
        try {
            await axios.post('https://s60-mohanavamsi-chayo.onrender.com/login', {
                email: 'm@gmail.com',
                password: 'wrongpass'
            });
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data).toHaveProperty('message', "User not in database");
        }
    });
});