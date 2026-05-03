import Phaser from 'phaser';

export default class PoolScene extends Phaser.Scene {
  constructor() {
    super('PoolScene');
  }

  create() {
    this.socket = this.registry.get('socket');
    this.roomId = 'room_vip_1'; 
    
    // Trạng thái Multiplayer
    this.myRole = null;
    this.currentTurn = null;
    this.gameState = 'waiting'; // waiting, placing (đặt bi), playing

    // ==========================================
    // 1. THIẾT LẬP BÀN VÀ ĐỒ HỌA
    // ==========================================
    // Bàn thu nhỏ lại còn 650x350, chừa 150px bên phải làm UI
    this.matter.world.setBounds(0, 0, 650, 350);

    // MÁY IN 9 BI SỐ CỰC XỊN (Vẽ 1-9 tự động)
    const ballColors = [
        0xfacc15, 0x3b82f6, 0xef4444, 0xa855f7, 0xf97316, // 1-Vàng, 2-Xanh, 3-Đỏ, 4-Tím, 5-Cam
        0x22c55e, 0x7f1d1d, 0x111827, 0xfef08a             // 6-Xanh lá, 7-Nâu sẫm, 8-Đen, 9-Vàng sọc
    ];

    for (let i = 1; i <= 9; i++) {
        if (!this.textures.exists('tex_ball_' + i)) {
            // Tạo 1 khung Canvas ẩn kích thước 24x24 (bán kính 12)
            const rt = this.add.renderTexture(-100, -100, 24, 24);
            const g = this.add.graphics();
            
            // Đổ màu nền cho viên bi
            g.fillStyle(ballColors[i-1], 1).fillCircle(12, 12, 12);
            // Vẽ lòng trắng ở giữa
            g.fillStyle(0xffffff, 1).fillCircle(12, 12, 6); 
            
            // Ghi số lên (1-9)
            const t = this.add.text(12, 12, i.toString(), { 
                fontFamily: 'Arial', fontSize: '10px', color: '#000000', fontStyle: 'bold' 
            }).setOrigin(0.5);

            // Dập Graphics và Text lại thành 1 Tấm Ảnh duy nhất
            rt.draw(g); rt.draw(t);
            rt.saveTexture('tex_ball_' + i);
            g.destroy(); t.destroy(); rt.destroy();
        }
    }

    // Tự động tạo các ảnh đồ họa khác (Bi trắng, Gậy, Lỗ)
    if (!this.textures.exists('tex_white')) {
        const whiteG = this.add.graphics(); whiteG.fillStyle(0xffffff, 1).fillCircle(12, 12, 12).generateTexture('tex_white', 24, 24); whiteG.destroy();
    }
    if (!this.textures.exists('tex_cue')) {
        const cueG = this.add.graphics(); cueG.fillStyle(0xd58b54, 1).fillRect(0, 0, 150, 4); cueG.fillStyle(0x000000, 1).fillRect(0, 0, 8, 4); cueG.generateTexture('tex_cue', 150, 4); cueG.destroy();
    }
    if (!this.textures.exists('tex_pocket')) {
        const pocketG = this.add.graphics(); pocketG.fillStyle(0x000000, 1).fillCircle(18, 18, 18).generateTexture('tex_pocket', 36, 36); pocketG.destroy();
    }

    // Vẽ Vạch xuất phát
    const tableLines = this.add.graphics();
    tableLines.lineStyle(2, 0xffffff, 0.3);
    tableLines.beginPath().moveTo(150, 0).lineTo(150, 350).strokePath();

    // Vẽ khung Thanh Lực bên phải
    this.add.rectangle(725, 175, 40, 250, 0x1f2937).setStrokeStyle(4, 0xca8a04);
    this.powerFill = this.add.graphics(); // Đồ họa để vẽ mức năng lượng
    
    // UI Hiển thị Lượt đánh
    this.turnText = this.add.text(400, 15, 'ĐANG CHỜ ĐỐI THỦ...', { font: 'bold 20px Arial', fill: '#facc15' }).setOrigin(0.5);

    // ==========================================
    // 2. KHỞI TẠO VẬT LÝ VÀ BỐ TRÍ BI SỐ 1-9
    // ==========================================
    const pocketPos = [{ x: 5, y: 5 }, { x: 325, y: -5 }, { x: 645, y: 5 }, { x: 5, y: 345 }, { x: 325, y: 355 }, { x: 645, y: 345 }];
    pocketPos.forEach(pos => {
        this.matter.add.image(pos.x, pos.y, 'tex_pocket').setCircle(15, { isStatic: true, isSensor: true, label: 'pocket' }).setDepth(-1);
    });

    const ballPhys = { friction: 0.001, frictionAir: 0.008, restitution: 0.95 };

    this.whiteBall = this.matter.add.image(100, 175, 'tex_white').setCircle(12, ballPhys).setMass(1);
    this.whiteBall.body.label = 'white_ball';

    // Xếp Dàn bi 9 viên (Xếp số 1 đầu, số 9 giữa)
    const startX = 480, startY = 175, stepX = 21, stepY = 12; 
    const rackOffsets = [
        {c: 0, r: 0, num: 1},                    // Hàng 1
        {c: 1, r: -1, num: 2}, {c: 1, r: 1, num: 3}, // Hàng 2
        {c: 2, r: -2, num: 4}, {c: 2, r: 0, num: 9}, {c: 2, r: 2, num: 5}, // Hàng 3 (Số 9 giữa)
        {c: 3, r: -1, num: 6}, {c: 3, r: 1, num: 7}, // Hàng 4
        {c: 4, r: 0, num: 8}                     // Hàng 5
    ];
    rackOffsets.forEach(pos => {
        const ball = this.matter.add.image(startX + pos.c * stepX, startY + pos.r * stepY, 'tex_ball_' + pos.num)
            .setCircle(12, ballPhys).setMass(1);
        ball.body.label = 'target_ball';
    });

    // ==========================================
    // 3. ĐỒ HỌA TIA NGẮM kép VÀ GẬY
    // ==========================================
    this.aimLine = this.add.graphics(); // Lớp vẽ tia lode đồng bộ
    this.cue = this.add.image(100, 175, 'tex_cue').setOrigin(1.1, 0.5).setVisible(false);
    
    // Ghost Ball (Bi trắng giả định lúc chạm)
    this.ghostBall = this.add.image(0, 0, 'tex_white').setAlpha(0.3).setVisible(false);

    this.isAiming = false;
    this.isPowering = false;
    this.powerValue = 0;
    this.aimAngle = 0;

    // ==========================================
    // 4. KẾT NỐI MẠNG & NHẬN LƯỢT ĐÁNH
    // ==========================================
    if (this.socket) {
        this.socket.emit('join_room', this.roomId);
        this.socket.on('role_assigned', (role) => { this.myRole = role; });
        this.socket.on('game_start', (data) => { this.currentTurn = data.currentTurn; this.updateTurnUI(); if (this.myRole === 'Player 1') this.gameState = 'placing'; });
        this.socket.on('update_turn', (nextTurn) => { this.currentTurn = nextTurn; this.gameState = 'playing'; this.updateTurnUI(); });
        this.socket.on('opponent_left', () => { alert("Đối thủ đã bỏ chạy! Bạn thắng!"); this.scene.pause(); });
        this.socket.on('opponent_place_ball', (data) => { this.whiteBall.setPosition(data.x, data.y); });
        this.socket.on('opponent_strike', (data) => { this.whiteBall.applyForce({ x: Math.cos(data.angle) * data.force, y: Math.sin(data.angle) * data.force }); });

        // NHẬN DỮ LIỆU NGẮM TỪ ĐỐI THỦ VÀ VẼ LÊN MÀN HÌNH MÌNH
        this.socket.on('opponent_aiming', (data) => {
            this.cue.setVisible(data.isVisible).setPosition(this.whiteBall.x, this.whiteBall.y).setRotation(data.angle + Math.PI);
            this.drawAimLines(data.isVisible, data.angle);
        });
    }

    // Va chạm rớt lỗ
    this.matter.world.on('collisionstart', (event) => {
        event.pairs.forEach((pair) => {
            if (pair.bodyA.label === 'pocket' || pair.bodyB.label === 'pocket') {
                const ball = pair.bodyA.label === 'pocket' ? pair.bodyB : pair.bodyA;
                if (ball.gameObject) {
                    if (ball.label === 'white_ball') {
                        // Trượt cái -> Tự động nhường lượt + Cho đối thủ đặt bi
                        ball.gameObject.setPosition(100, 175); ball.gameObject.setVelocity(0, 0);
                        if (this.currentTurn === this.myRole) {
                            const nextTurn = this.myRole === 'Player 1' ? 'Player 2' : 'Player 1';
                            this.socket.emit('strike_ball', { roomId: this.roomId, angle: 0, force: 0, nextTurn: nextTurn });
                            this.gameState = 'placing'; // Cho đối thủ đặt
                        }
                    } else { ball.gameObject.destroy(); }
                }
            }
        });
    });

    // ==========================================
    // 5. CƠ CHẾ ĐIỀU KHIỂN & THANH LỰC
    // ==========================================
    this.input.on('pointerdown', (pointer) => {
        if (this.currentTurn !== this.myRole) return; 

        if (this.gameState === 'placing' && pointer.x < 650) {
            this.gameState = 'playing'; return;
        }

        if (this.whiteBall.body.speed < 0.1) {
            if (pointer.x > 700) { 
                this.isPowering = true; // Bấm vào thanh lực
            } else if (pointer.x < 650) {
                this.isAiming = true;   // Bấm vào bàn để ngắm
                this.cue.setVisible(true);
            }
        }
    });

    this.input.on('pointermove', (pointer) => {
        if (this.currentTurn !== this.myRole) return;

        if (this.gameState === 'placing') {
            const newX = Phaser.Math.Clamp(pointer.x, 20, 150), newY = Phaser.Math.Clamp(pointer.y, 20, 330);
            this.whiteBall.setPosition(newX, newY);
            if (this.socket) this.socket.emit('place_ball', { roomId: this.roomId, x: newX, y: newY });
            return;
        }

        if (this.isAiming) {
            this.aimAngle = Phaser.Math.Angle.Between(this.whiteBall.x, this.whiteBall.y, pointer.x, pointer.y);
            this.cue.setPosition(this.whiteBall.x, this.whiteBall.y).setRotation(this.aimAngle + Math.PI);
            
            this.drawAimLines(true, this.aimAngle); // Vẽ cục bộ

            // Gửi dữ liệu ngắm cho đối thủ
            if (this.socket) {
                this.socket.emit('aiming', { roomId: this.roomId, isVisible: true, angle: this.aimAngle });
            }
        } 
        
        else if (this.isPowering) {
            const powerY = Phaser.Math.Clamp(pointer.y, 50, 300);
            this.powerValue = (powerY - 50) / 250; 
            this.powerFill.clear().fillStyle(0xdc2626, 1).fillRect(705, powerY, 40, 300 - powerY);
            this.cue.setOrigin(1.1 + (this.powerValue * 0.5), 0.5);
        }
    });

    this.input.on('pointerup', () => {
        this.isAiming = false;
        if (this.socket) { this.socket.emit('aiming', { roomId: this.roomId, isVisible: false, angle: 0 }); }
        
        if (this.isPowering) {
            this.isPowering = false; this.cue.setVisible(false); this.aimLine.clear(); this.powerFill.clear(); this.ghostBall.setVisible(false);

            if (this.powerValue > 0.05) {
                const force = this.powerValue * 0.15; 
                this.whiteBall.applyForce({ x: Math.cos(this.aimAngle) * force, y: Math.sin(this.aimAngle) * force });
                const nextTurn = this.myRole === 'Player 1' ? 'Player 2' : 'Player 1';
                if (this.socket) { this.socket.emit('strike_ball', { roomId: this.roomId, angle: this.aimAngle, force: force, nextTurn: nextTurn }); }
                this.currentTurn = 'waiting'; this.updateTurnUI();
            }
            this.powerValue = 0; this.cue.setOrigin(1.1, 0.5);
        }
    });
  }

  // HÀM VẼ TIA NGẮM kép (Hỗ trợ ngắm ngược và đồng bộ mạng)
  drawAimLines(isVisible, angle) {
    this.aimLine.clear();
    this.ghostBall.setVisible(false);
    if (!isVisible) return;

    this.aimLine.lineStyle(2, 0xffffff, 0.5);

    // Tia 1: Đường bi cái lăn đi
    const startX = this.whiteBall.x, startY = this.whiteBall.y;
    const endX = startX + Math.cos(angle) * 400;
    const endY = startY + Math.sin(angle) * 400;
    this.aimLine.beginPath().moveTo(startX, startY).lineTo(endX, endY).strokePath();

    // Tia 2: Ngắm ngược (Ghost ball) và đường bi mục tiêu
    const raycastResult = this.matter.add.raycast(
        { x: startX, y: startY }, 
        { x: endX, y: endY }, 
        null, 
        (body) => body.label === 'target_ball' // Chỉ raycast trúng bi đỏ/số
    );

    if (raycastResult) {
        const hit = raycastResult;
        // Hiện bi trắng giả định (Ghost ball) tại điểm chạm
        this.ghostBall.setVisible(true).setPosition(hit.gameObject.x, hit.gameObject.y);

        // Vẽ tia laze phản xạ từ bi mục tiêu đi
        this.aimLine.beginPath().moveTo(hit.gameObject.x, hit.gameObject.y)
        this.aimLine.lineTo(hit.gameObject.x + Math.cos(angle + 0.5) * 150, hit.gameObject.y + Math.sin(angle + 0.5) * 150).strokePath();
    }
  }

  updateTurnUI() {
    if (this.currentTurn === this.myRole) { this.turnText.setText('LƯỢT CỦA BẠN').setColor('#22c55e'); } 
    else { this.turnText.setText('LƯỢT ĐỐI THỦ').setColor('#ef4444'); }
  }

  update() { }
}