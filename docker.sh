#!/bin/bash
# sudo chmod -R 777 /home/cmon/appcmon
# sudo chmod -R 777 /home/cmon/developer_document/DevOps/cmd
# developer_document/DevOps/cmd
# สคริปต์ติดตั้ง Docker, Python, Node.js และ Docker Compose บน Ubuntu
# โดย: [ใส่ชื่อผู้สร้าง]
# วันที่: $(date)  y
# sudo ./docker.sh
set -e  # ออกจากสคริปต์ทันทีหากมีคำสั่งใดล้มเหลว

# ฟังก์ชันแสดงข้อความสถานะ
print_status() {
    echo -e "\n\033[1;34m==>\033[0m \033[1m$1\033[0m"
}

# ฟังก์ชันแสดงข้อความสำเร็จ
print_success() {
    echo -e "\033[1;32m✓\033[0m $1"
}

# ฟังก์ชันแสดงข้อความผิดพลาด
print_error() {
    echo -e "\033[1;31m✗\033[0m $1" >&2
}

# ฟังก์ชันตรวจสอบว่าทำงานด้วยสิทธิ์ root หรือไม่
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "สคริปต์นี้ต้องใช้สิทธิ์ root (sudo) ในการรัน"
        exit 1
    fi
}

# ฟังก์ชันติดตั้ง Python
install_python() {
    print_status "กำลังติดตั้ง Python..."
    
    # อัพเดทแพ็คเกจลิสต์
    apt-get update
    
    # ติดตั้ง Python3 และ pip
    apt-get install -y python3 python3-pip python3-venv
    
    # ตรวจสอบการติดตั้ง
    python3 --version
    pip3 --version
    
    print_success "ติดตั้ง Python สำเร็จแล้ว"
}

# ฟังก์ชันติดตั้ง Node.js เวอร์ชัน 22.20.0
install_nodejs() {
    print_status "กำลังติดตั้ง Node.js เวอร์ชัน 22.20.0..."
    
    # ล้างแคชก่อน
    rm -rf /etc/apt/sources.list.d/nodesource.list*
    
    # ติดตั้ง curl หากยังไม่มี
    apt-get install -y curl
    
    # ดาวน์โหลดและรันสคริปต์ติดตั้ง NodeSource สำหรับ Node.js 22.x
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    
    # ติดตั้ง Node.js
    apt-get install -y nodejs
    
    # ตรวจสอบเวอร์ชัน
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    
    echo "Node.js เวอร์ชัน: $NODE_VERSION"
    echo "npm เวอร์ชัน: $NPM_VERSION"
    
    # ตรวจสอบว่าเป็นเวอร์ชันที่ต้องการหรือไม่
    if [[ "$NODE_VERSION" == "v22.20.0" ]]; then
        print_success "ติดตั้ง Node.js เวอร์ชัน 22.20.0 สำเร็จแล้ว"
    else
        print_status "ติดตั้ง Node.js สำเร็จแต่เป็นเวอร์ชัน $NODE_VERSION (ไม่ใช่ 22.20.0 พอดี)"
        
        # ทางเลือก: ติดตั้ง n สำหรับจัดการเวอร์ชัน Node.js
        print_status "กำลังติดตั้ง n สำหรับจัดการเวอร์ชัน Node.js..."
        npm install -g n
        n 22.20.0
        
        # อัพเดท PATH
        export PATH="$PATH:/usr/local/bin"
        
        # ตรวจสอบเวอร์ชันอีกครั้ง
        NODE_VERSION=$(node --version)
        echo "Node.js เวอร์ชันปัจจุบัน: $NODE_VERSION"
    fi
    
    # ติดตั้ง yarn (ตัวเลือก)
    print_status "กำลังติดตั้ง yarn..."
    npm install -g yarn
    
    print_success "ติดตั้ง Node.js และ npm สำเร็จแล้ว"
}

# ฟังก์ชันติดตั้ง Docker
install_docker() {
    print_status "กำลังติดตั้ง Docker..."
    
    # ติดตั้งแพ็คเกจที่จำเป็น
    apt-get install -y \
        apt-transport-https \
        ca-certificates \
        software-properties-common \
        gnupg \
        lsb-release
    
    # เพิ่ม Docker GPG key
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # เพิ่ม Docker repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # อัพเดทแพ็คเกจลิสต์
    apt-get update
    
    # ติดตั้ง Docker Engine
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin
    
    # เริ่มต้นและเปิดใช้งาน Docker service
    systemctl start docker
    systemctl enable docker
    
    # เพิ่มผู้ใช้งานปัจจุบันเข้า Docker group (เพื่อรัน Docker โดยไม่ต้องใช้ sudo)
    if [ "$SUDO_USER" != "" ]; then
        usermod -aG docker $SUDO_USER
        print_status "เพิ่มผู้ใช้งาน $SUDO_USER เข้า Docker group แล้ว"
        print_status "กรุณา logout และ login ใหม่เพื่อให้การเปลี่ยนแปลงมีผล"
    fi
    
    # ตรวจสอบการติดตั้ง
    docker --version
    docker run hello-world
    
    print_success "ติดตั้ง Docker สำเร็จแล้ว"
}

# ฟังก์ชันติดตั้ง Docker Compose
install_docker_compose() {
    print_status "กำลังติดตั้ง Docker Compose..."
    
    # ดาวน์โหลด Docker Compose เวอร์ชันล่าสุด
    # ตรวจสอบเวอร์ชันล่าสุดจาก GitHub
    COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep '"tag_name"' | sed -E 's/.*"([^"]+)".*/\1/')
    
    # ดาวน์โหลดและติดตั้ง Docker Compose
    curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    # กำหนดสิทธิ์การรัน
    chmod +x /usr/local/bin/docker-compose
    
    # สร้าง symbolic link
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    # ตรวจสอบการติดตั้ง
    docker-compose --version
    
    print_success "ติดตั้ง Docker Compose เวอร์ชัน ${COMPOSE_VERSION} สำเร็จแล้ว"
}

# ฟังก์ชันแสดงสรุป
show_summary() {
    echo ""
    echo "=========================================="
    echo "         สรุปการติดตั้งสำเร็จ             "
    echo "=========================================="
    echo ""
    
    # แสดงเวอร์ชันของซอฟต์แวร์ที่ติดตั้ง
    echo "1. Python:"
    python3 --version 2>/dev/null || echo "  ไม่พบ Python"
    
    echo ""
    echo "2. Node.js:"
    node --version 2>/dev/null || echo "  ไม่พบ Node.js"
    npm --version 2>/dev/null && echo "  npm: $(npm --version 2>/dev/null)"
    
    echo ""
    echo "3. Docker:"
    docker --version 2>/dev/null || echo "  ไม่พบ Docker"
    
    echo ""
    echo "4. Docker Compose:"
    docker-compose --version 2>/dev/null || echo "  ไม่พบ Docker Compose"
    
    echo ""
    echo "=========================================="
    echo "หมายเหตุ:"
    echo "- สำหรับการใช้งาน Docker โดยไม่ต้องใช้ sudo"
    echo "  ให้ logout และ login ใหม่"
    echo "- สำหรับการเปลี่ยนเวอร์ชัน Node.js"
    echo "  สามารถใช้คำสั่ง 'n' ได้"
    echo "=========================================="
}

# ฟังก์ชันหลัก
main() {
    # แสดงหัวข้อ
    echo "=========================================="
    echo "   สคริปต์ติดตั้ง Docker Stack บน Ubuntu   "
    echo "=========================================="
    echo ""
    echo "จะติดตั้งซอฟต์แวร์ต่อไปนี้:"
    echo "1. Python 3 และ pip"
    echo "2. Node.js เวอร์ชัน 22.20.0"
    echo "3. Docker Engine"
    echo "4. Docker Compose"
    echo ""
    echo "ระบบปฏิบัติการ: $(lsb_release -d | cut -f2)"
    echo "สถาปัตยกรรม: $(uname -m)"
    echo ""
    
    # ขอการยืนยันจากผู้ใช้
    read -p "ต้องการติดตั้งตอนนี้หรือไม่? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "ยกเลิกการติดตั้ง"
        exit 0
    fi
    
    # ตรวจสอบสิทธิ์ root
    check_root
    
    # บันทึกเวลาเริ่มต้น
    START_TIME=$(date +%s)
    
    # ติดตั้งแพ็คเกจทั้งหมดตามลำดับ
    install_python
    install_nodejs
    install_docker
    install_docker_compose
    
    # คำนวณเวลาที่ใช้
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    # แสดงสรุป
    show_summary
    
    echo ""
    print_success "การติดตั้งเสร็จสมบูรณ์ในเวลา $DURATION วินาที"
}

# รันฟังก์ชันหลัก
main "$@"